import React, { useState, useEffect } from 'react';
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Container,
  Content,
  EventImage,
  Label,
  StepDiv,
  StepperWrapper,
  StepTitle,
} from './styles';
import EventLogo from '../../assets/event-logo.png';
import api from '../../services/api';
import InputMask from 'react-input-mask';
import * as Yup from 'yup';

const steps = ['Tipo de inscrição', 'Cadastro dos Atletas', 'Pagamento'];

type Pix = {
  qrCode: string;
  qrCodeUrl: string;
};

type Result = {
  pix: Pix;
  chargeId: string;
};

type Athlete = {
  [key: string]: any;
  name: string;
  cpf: string;
  email: string;
  phone_number: string;
  birth_date: string;
  shirt_size: string;
  gender: string;
  address: {
    line_1: string;
    line_2: string;
    zip_code: string;
    city: string;
    state: string;
    country: string;
  };
};

type FormData = {
  selectedCategory: string;
  teamName: string;
  box: string;
  athletes: Athlete[];
  result: Result;
};

export const CreateAccount = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([] as any);
  const [formData, setFormData] = useState<FormData>({
    selectedCategory: '',
    teamName: '',
    box: '',
    athletes: [
      {
        name: '',
        cpf: '',
        email: '',
        phone_number: '',
        birth_date: '',
        shirt_size: '',
        gender: '',
        address: {
          line_1: '',
          line_2: '',
          zip_code: '',
          city: '',
          state: '',
          country: 'BR',
        },
      },
    ],
    result: {
      chargeId: '',
      pix: {
        qrCode: '',
        qrCodeUrl: '',
      },
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lots, setLots] = useState([] as any[]);
  const [pixCode, setPixCode] = useState('');

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLots = async () => {
    setLoading(true);
    try {
      const response = await api.get('/lots');
      setLots(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentStep === 2) {
      getLots();
    }
  }, [currentStep]);

  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find(
      (cat: any) => cat.id === categoryId
    );

    if (selectedCategory) {
      const athleteNumber = selectedCategory.athlete_number;

      const athletes: Athlete[] = Array.from({ length: athleteNumber }, () => ({
        name: '',
        cpf: '',
        email: '',
        phone_number: '',
        birth_date: '',
        shirt_size: '',
        gender: '',
        address: {
          line_1: '',
          line_2: '',
          zip_code: '',
          city: '',
          state: '',
          country: 'BR',
        },
      }));

      setFormData((prev) => ({
        ...prev,
        selectedCategory: categoryId,
        athletes,
      }));
    }
  };

  const handleNextStep = async () => {
    try {
      setErrors({});

      if (currentStep === 0) {
        const schema = Yup.object().shape({
          selectedCategory: Yup.string().required('Categoria é obrigatória'),
          teamName: Yup.string().required('Nome do time é obrigatório'),
          box: Yup.string().required('Box é obrigatório'),
        });

        await schema.validate(
          {
            selectedCategory: formData.selectedCategory,
            teamName: formData.teamName,
            box: formData.box,
          },
          { abortEarly: false }
        );
      }

      if (currentStep === 1) {
        const athleteSchema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório'),
          cpf: Yup.string().required('CPF é obrigatório'),
          email: Yup.string()
            .email('Email inválido')
            .required('Email é obrigatório'),
          phone_number: Yup.string().required('Contato é obrigatório'),
          birth_date: Yup.date().required('Data de nascimento é obrigatória'),
          shirt_size: Yup.string().required('Tamanho da camisa é obrigatório'),
          gender: Yup.string().required('Gênero é obrigatório'),
        });

        const schema = Yup.array().of(athleteSchema);

        await schema.validate(formData.athletes, { abortEarly: false });

        // Transformar dados e enviar ao back-end
        const data = {
          name: formData.teamName,
          box: formData.box,
          category_id: formData.selectedCategory,
          athletes: formData.athletes.map((athlete) => ({
            ...athlete,
            cpf: athlete.cpf.replace(/\D/g, ''), // Remover máscara do CPF
            phone_number: athlete.phone_number.replace(/\D/g, ''), // Remover máscara do telefone
            gender: athlete.gender === 'Masculino' ? 'm' : 'f', // Converter gênero
          })),
        };

        setLoading(true);
        try {
          await api.post('/teams', data);
          console.log('Dados enviados com sucesso:', data);
        } catch (error) {
          console.error('Erro ao enviar dados:', error);
        } finally {
          setLoading(false);
        }
      }

      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {} as any;
        err.inner.forEach((error: any) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleAthleteChange = (index: number, field: string, value: string) => {
    const updatedAthletes = [...formData.athletes];
    if (field.includes('address')) {
      const [parent, child] = field.split('.');
      const parentField = parent as keyof Athlete; // Garantir que o campo existe em Athlete
      if (
        updatedAthletes[index][parentField] &&
        typeof updatedAthletes[index][parentField] === 'object'
      ) {
        (updatedAthletes[index][parentField] as Record<string, any>)[child] =
          value;
      }
    } else {
      const fieldKey = field as keyof Athlete; // Garantir que o campo existe em Athlete
      updatedAthletes[index][fieldKey] = value as Athlete[typeof fieldKey];
    }

    setFormData((prev) => ({ ...prev, athletes: updatedAthletes }));
  };

  const fetchAddressByZipCode = async (zip_code: string, index: number) => {
    if (!/^\d{5}-?\d{3}$/.test(zip_code)) {
      setErrors((prev) => ({
        ...prev,
        [`athletes[${index}].address.zip_code`]: 'CEP inválido',
      }));
      return;
    }

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${zip_code.replace(/\D/g, '')}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        setErrors((prev) => ({
          ...prev,
          [`athletes[${index}].address.zip_code`]: 'CEP não encontrado',
        }));
        return;
      }

      const updatedAthletes = [...formData.athletes];
      updatedAthletes[index].address = {
        ...updatedAthletes[index].address,
        line_1: `${data.logradouro}, ${data.bairro}`,
        zip_code,
        city: data.localidade,
        state: data.uf,
        country: 'BR',
      };
      setFormData((prev) => ({ ...prev, athletes: updatedAthletes }));
    } catch (error) {
      console.error('Erro ao buscar o CEP:', error);
      setErrors((prev) => ({
        ...prev,
        [`athletes[${index}].address.zip_code`]: 'Erro ao buscar o CEP',
      }));
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulando geração de código PIX
      setPixCode('1234567890ABCDEF');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <EventImage src={EventLogo} alt="Event Logo" />

      <Content>
        <StepperWrapper>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </StepperWrapper>

        {currentStep === 0 && (
          <StepDiv>
            <StepTitle>Escolha a Categoria</StepTitle>
            <TextField
              select
              label="Categoria"
              value={formData.selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors.selectedCategory}
              helperText={errors.selectedCategory}
            >
              {categories.map((category: any) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Nome do Time"
              value={formData.teamName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  teamName: e.target.value,
                }))
              }
              fullWidth
              margin="normal"
              error={!!errors.teamName}
              helperText={errors.teamName}
            />
            <TextField
              label="Box do Time"
              value={formData.box}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  box: e.target.value,
                }))
              }
              fullWidth
              margin="normal"
              error={!!errors.box}
              helperText={errors.box}
            />
          </StepDiv>
        )}

        {currentStep === 1 && (
          <div>
            {formData.athletes.map((athlete, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '16px',
                  padding: '16px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
              >
                <StepTitle>Atleta</StepTitle>

                <TextField
                  label="Nome"
                  value={athlete.name}
                  onChange={(e) =>
                    handleAthleteChange(index, 'name', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  error={!!errors[`athletes[${index}].name`]}
                  helperText={errors[`athletes[${index}].name`]}
                />
                <InputMask
                  mask="999.999.999-99"
                  value={athlete.cpf}
                  onChange={(e) =>
                    handleAthleteChange(index, 'cpf', e.target.value)
                  }
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      label="CPF"
                      fullWidth
                      margin="normal"
                      error={!!errors[`athletes[${index}].cpf`]}
                      helperText={errors[`athletes[${index}].cpf`]}
                    />
                  )}
                </InputMask>
                <TextField
                  label="Email"
                  value={athlete.email}
                  onChange={(e) =>
                    handleAthleteChange(index, 'email', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  error={!!errors[`athletes[${index}].email`]}
                  helperText={errors[`athletes[${index}].email`]}
                />
                <InputMask
                  mask="(99) 99999-9999"
                  value={athlete.phone_number}
                  onChange={(e) =>
                    handleAthleteChange(index, 'phone_number', e.target.value)
                  }
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      label="Contato"
                      fullWidth
                      margin="normal"
                      error={!!errors[`athletes[${index}].phone_number`]}
                      helperText={errors[`athletes[${index}].phone_number`]}
                    />
                  )}
                </InputMask>
                <InputMask
                  mask="99999-999"
                  value={athlete.address.zip_code}
                  onChange={(e) => {
                    handleAthleteChange(
                      index,
                      'address.zip_code',
                      e.target.value
                    );
                    if (e.target.value.length === 9) {
                      fetchAddressByZipCode(e.target.value, index);
                    }
                  }}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      label="CEP"
                      fullWidth
                      margin="normal"
                      error={!!errors[`athletes[${index}].address.zip_code`]}
                      helperText={errors[`athletes[${index}].address.zip_code`]}
                    />
                  )}
                </InputMask>
                <TextField
                  label="Endereço"
                  value={athlete.address.line_1}
                  onChange={(e) =>
                    handleAthleteChange(index, 'address.line_1', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Número"
                  value={athlete.address.line_2}
                  onChange={(e) =>
                    handleAthleteChange(index, 'address.line_2', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Cidade"
                  value={athlete.address.city}
                  onChange={(e) =>
                    handleAthleteChange(index, 'address.city', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Estado"
                  value={athlete.address.state}
                  onChange={(e) =>
                    handleAthleteChange(index, 'address.state', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="País"
                  value={athlete.address.country}
                  onChange={(e) =>
                    handleAthleteChange(
                      index,
                      'address.country',
                      e.target.value
                    )
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Data de Nascimento"
                  value={athlete.birth_date || ''}
                  onChange={(e) =>
                    handleAthleteChange(index, 'birth_date', e.target.value)
                  }
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                  error={!!errors[`athletes[${index}].birth_date`]}
                  helperText={errors[`athletes[${index}].birth_date`]}
                  sx={{
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                      filter: 'invert(1)',
                    },
                  }}
                />
                <TextField
                  select
                  label="Tamanho da Camisa"
                  value={athlete.shirt_size || ''}
                  onChange={(e) =>
                    handleAthleteChange(index, 'shirt_size', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  error={!!errors[`athletes[${index}].shirt_size`]}
                  helperText={errors[`athletes[${index}].shirt_size`]}
                >
                  {['P', 'M', 'G', 'GG'].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </TextField>

                <div style={{ margin: '16px 0' }}>
                  <Label>Gênero</Label>

                  <div style={{ marginTop: 8 }}>
                    <label style={{ color: 'white', marginRight: 16 }}>
                      <input
                        type="radio"
                        value="Masculino"
                        checked={athlete.gender === 'Masculino'}
                        onChange={(e) =>
                          handleAthleteChange(index, 'gender', e.target.value)
                        }
                        style={{
                          accentColor: '#f04c12',
                        }}
                      />
                      Masculino
                    </label>
                    <label style={{ color: 'white' }}>
                      <input
                        type="radio"
                        value="Feminino"
                        checked={athlete.gender === 'Feminino'}
                        onChange={(e) =>
                          handleAthleteChange(index, 'gender', e.target.value)
                        }
                        style={{
                          accentColor: '#f04c12',
                        }}
                      />
                      Feminino
                    </label>
                  </div>
                  {errors[`athletes[${index}].gender`] && (
                    <p style={{ color: 'red' }}>
                      {errors[`athletes[${index}].gender`]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentStep === 2 && (
          <StepDiv>
            <StepTitle>Pagamento</StepTitle>
            {loading ? (
              <CircularProgress />
            ) : pixCode ? (
              <div>
                <h1>Valor da inscrição: {lots[0]?.amount}</h1>
                <p>Código PIX gerado: {pixCode}</p>
              </div>
            ) : (
              <Button variant="contained" onClick={handlePayment}>
                Gerar Código PIX
              </Button>
            )}
          </StepDiv>
        )}
        <div style={{ marginTop: '24px' }}>
          {currentStep > 0 && (
            <Button onClick={handlePreviousStep} style={{ marginRight: '8px' }}>
              Voltar
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNextStep}>
              Próximo
            </Button>
          ) : null}
        </div>
      </Content>
    </Container>
  );
};
