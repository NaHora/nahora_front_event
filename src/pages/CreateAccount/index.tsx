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
  RegisterPayment,
  StepDiv,
  StepperWrapper,
  StepTitle,
} from './styles';
import Lottie from 'react-lottie';
import EventLogo from '../../assets/event-logo.png';
import InputMask from 'react-input-mask';
import * as Yup from 'yup';
import { CreditCard, QrCode } from '@mui/icons-material';
import { Typography, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import * as animationData from '../../assets/lottie.json';
import api from '../../services/api';

const steps = ['Tipo de inscrição', 'Cadastro dos Atletas', 'Pagamento'];

type Athlete = {
  [key: string]: any;
  name: string;
  cpf: string;
  email: string;
  phone_number: string;
  birth_date: string;
  shirt_size: string;
  gender: 'm' | 'f';
};

type BillingAddress = {
  line_1: string;
  line_2: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
};

type CardData = {
  number: string;
  holder_name: string;
  holder_document: string;
  exp_month: string;
  exp_year: string;
  cvv: string;
  billing_address: BillingAddress;
};

type PaymentData = {
  isPix: boolean;
  card?: CardData;
};

type FormData = {
  category_id: string;
  name: string;
  box: string;
  athletes: Athlete[];
};

export const CreateAccount = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [pix, setPix] = useState({ qrCode: '', qrCodeUrl: '' });
  const [categories, setCategories] = useState([] as any);
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = localStorage.getItem('athleteData');
    return savedData
      ? JSON.parse(savedData)
      : {
          category_id: '',
          name: '',
          box: '',
          athletes: [
            {
              name: '',
              cpf: '',
              email: '',
              phone_number: '',
              birth_date: '',
              shirt_size: '',
              gender: 'm',
            },
          ],
        };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [installments, setInstallments] = useState(1);
  const [lot, setLot] = useState({ amount: 0 });
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | ''>('');
  const [cardData, setCardData] = useState<CardData>({
    number: '',
    holder_name: '',
    holder_document: '',
    exp_month: '',
    exp_year: '',
    cvv: '',
    billing_address: {
      line_1: '',
      line_2: '',
      zip_code: '',
      city: '',
      state: '',
      country: 'Brasil',
    },
  });
  const normalizeCardNumber = (number: string) => number.replace(/\s+/g, '');
  const [teamId, setTeamId] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);

  const handlePaymentMethod = (method: 'pix' | 'card') => {
    setPaymentMethod(method);
  };

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    setLoadingCategory(true);
    try {
      const response = await api.get(
        '/category/event/1f0fd51d-cd1c-43a9-80ed-00d039571520'
      );
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoadingCategory(false);
    }
  };

  const getLots = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        '/lots/event/1f0fd51d-cd1c-43a9-80ed-00d039571520'
      );
      setLot(response.data);
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
    const category_id = categories.find((cat: any) => cat.id === categoryId);

    if (category_id) {
      const athleteNumber = category_id.athlete_number;

      const athletes: Athlete[] = Array.from({ length: athleteNumber }, () => ({
        name: '',
        cpf: '',
        email: '',
        phone_number: '',
        birth_date: '',
        shirt_size: '',
        gender: 'm',
      }));

      setFormData((prev) => ({
        ...prev,
        category_id: categoryId,
        athletes,
      }));
    }
  };

  const validationSchemas: Record<number, Yup.AnySchema> = {
    0: Yup.object().shape({
      category_id: Yup.string().required('Categoria é obrigatória'),
      name: Yup.string().required('Nome do time é obrigatório'),
      box: Yup.string().required('Box é obrigatório'),
    }),
    1: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        cpf: Yup.string().required('CPF é obrigatório'),
        email: Yup.string()
          .email('Email inválido')
          .required('Email é obrigatório'),
        phone_number: Yup.string().required('Contato é obrigatório'),
        birth_date: Yup.string().required('Data de nascimento é obrigatória'),
        shirt_size: Yup.string().required('Tamanho da camisa é obrigatório'),
        gender: Yup.string().required('Gênero é obrigatório'),
      })
    ),
    2: Yup.object().shape({
      isPix: Yup.boolean(),
      card: Yup.object().shape({
        number: Yup.string().when('isPix', {
          is: false,
          then: Yup.string().required('Número do cartão é obrigatório'),
        }),
        name: Yup.string().when('isPix', {
          is: false,
          then: Yup.string().required('Nome no cartão é obrigatório'),
        }),
        expiry: Yup.string().when('isPix', {
          is: false,
          then: Yup.string().required('Data de expiração é obrigatória'),
        }),
        cvv: Yup.string().when('isPix', {
          is: false,
          then: Yup.string().required('CVV é obrigatório'),
        }),
        billing_address: Yup.object().shape({
          line_1: Yup.string().required('Endereço é obrigatório'),
          zip_code: Yup.string().required('CEP é obrigatório'),
          city: Yup.string().required('Cidade é obrigatória'),
          state: Yup.string().required('Estado é obrigatório'),
        }),
      }),
    }),
  };

  const handleNextStep = async () => {
    try {
      setErrors({});
      const schema = validationSchemas[currentStep];
      const dataToValidate =
        currentStep === 1
          ? formData.athletes
          : currentStep === 2
          ? { isPix: paymentMethod === 'pix', card: cardData }
          : formData;

      await schema.validate(dataToValidate, { abortEarly: false });

      if (currentStep === 1) {
        localStorage.setItem('athleteData', JSON.stringify(formData));
      }
      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          validationErrors[error.path!] = error.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  const handlePayment = async () => {
    const sanitizedCardData = {
      ...cardData,
      cvv: cardData.cvv.replace(/[^0-9]/g, ''),
      number: normalizeCardNumber(cardData.number),
    };

    const dataToSend = {
      ...formData,
      athletes: formData.athletes.map((athlete) => ({
        ...athlete,
        cpf: athlete.cpf.replace(/\D/g, ''),
        phone_number: athlete.phone_number.replace(/\D/g, ''),
      })),
      ...(paymentMethod === 'card' && { card: sanitizedCardData }),
      isPix: paymentMethod === 'pix',
      installments,
    };

    setLoading(true);
    try {
      const res = await api.post('/teams', dataToSend);

      if (paymentMethod === 'pix') {
        if (res?.data?.result?.pix) {
          setPix(res?.data?.result?.pix);
          setTeamId(res.data.id);
          toast.success('PIX gerado com sucesso!');
        } else {
          toast.error('Falha ao gerar PIX. Tente novamente.');
        }
      } else if (paymentMethod === 'card') {
        if (res?.data?.result?.chargeId) {
          setCurrentStep(3);
          toast.success('Pagamento efetuado com sucesso!');
        } else {
          toast.error('Falha no pagamento com cartão.');
        }
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Erro ao processar pagamento.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      const result = await api.get(`/payments/team/${teamId}`);

      if (result.data.status === 'paid') {
        toast.success('Pagamento confirmado com sucesso!');
        setCurrentStep(3);
      } else {
        toast.error('Pagamento não confirmado. Verifique e tente novamente.');
      }
    } catch (error) {
      toast.error('Erro ao confirmar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleAthleteChange = (index: number, field: string, value: string) => {
    const updatedAthletes = [...formData.athletes];

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentField = parent as keyof Athlete;

      if (
        updatedAthletes[index][parentField] &&
        typeof updatedAthletes[index][parentField] === 'object'
      ) {
        (updatedAthletes[index][parentField] as Record<string, any>)[child] =
          value;
      } else {
        console.error(`Campo aninhado inválido: ${field}`);
        return;
      }
    } else {
      const fieldKey = field as keyof Athlete;
      if (fieldKey in updatedAthletes[index]) {
        updatedAthletes[index][fieldKey] = value as Athlete[typeof fieldKey];
      } else {
        console.error(`Campo inválido: ${field}`);
        return;
      }
    }

    setFormData((prev) => ({ ...prev, athletes: updatedAthletes }));
  };

  const fetchAddressByZipCode = async (zip_code: string) => {
    setLoadingCep(true);
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${zip_code.replace(/\D/g, '')}/json/`
      );
      const data = await response.json();

      if (!data.erro) {
        setCardData((prev) => ({
          ...prev,
          billing_address: {
            ...prev.billing_address,
            line_1: `${data.logradouro}, ${data.bairro}`,
            city: data.localidade,
            state: data.uf,
            zip_code: data.cep,
            country: 'BR',
          },
        }));
        toast.success('Endereço preenchido com sucesso!');
      } else {
        toast.error('CEP não encontrado.');
      }
    } catch (error) {
      toast.error('Erro ao buscar o CEP.');
    } finally {
      setLoadingCep(false);
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setCardData((prev) => ({
      ...prev,
      billing_address: {
        ...prev.billing_address,
        [field]: value,
      },
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pix?.qrCode);
      toast.success('Copiado com sucesso!');
    } catch (err) {
      console.error('Erro ao copiar o texto: ', err);
      toast.error('Falha ao copiar o texto.');
    }
  };

  const handleHolderDocumentChange = (value: string) => {
    setCardData((prev) => ({
      ...prev,
      holder_document: value.replace(/\D/g, ''),
    }));
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
            {!loadingCategory ? (
              <>
                <StepTitle>Escolha a Categoria</StepTitle>
                <TextField
                  select
                  label="Categoria"
                  value={formData.category_id}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  fullWidth
                  margin="normal"
                  error={!!errors.category_id}
                  helperText={errors.category_id}
                >
                  {categories.map((category: any) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Nome do Time"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name}
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
              </>
            ) : (
              <CircularProgress />
            )}
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
                        value="m"
                        checked={athlete.gender === 'm'}
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
                        value="f"
                        checked={athlete.gender === 'f'}
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
            <StepTitle>Selecione o método de pagamento:</StepTitle>
            <Grid
              container
              spacing={2}
              style={{ marginTop: '16px', marginBottom: '16px' }}
            >
              <Grid item xs={6}>
                <Button
                  variant={paymentMethod === 'pix' ? 'contained' : 'outlined'}
                  onClick={() => handlePaymentMethod('pix')}
                  startIcon={<QrCode />}
                  fullWidth
                >
                  PIX
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
                  onClick={() => handlePaymentMethod('card')}
                  startIcon={<CreditCard />}
                  fullWidth
                >
                  Cartão
                </Button>
              </Grid>
            </Grid>

            {paymentMethod === 'pix' && (
              <div style={{ marginTop: '20px' }}>
                {!pix.qrCode ? (
                  <>
                    <RegisterPayment>
                      Valor da inscrição: R${' '}
                      {(lot?.amount * formData.athletes.length) / 100}{' '}
                    </RegisterPayment>
                    <RegisterPayment>
                      Taxa de serviço: R${' '}
                      {(lot?.amount * formData.athletes.length * 0.08) / 100}{' '}
                    </RegisterPayment>
                    <RegisterPayment>
                      Valor total: R${' '}
                      {(lot?.amount * formData.athletes.length * 1.08) / 100}{' '}
                    </RegisterPayment>
                    <Button
                      variant="contained"
                      onClick={async () => {
                        try {
                          setLoading(true);
                          await handlePayment();
                        } catch (error) {
                          toast.error('Erro ao gerar o PIX. Tente novamente.');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      style={{ marginBottom: '16px' }}
                    >
                      {loading ? 'Gerando PIX...' : 'Gerar PIX'}
                    </Button>
                  </>
                ) : (
                  <div
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <img
                      src={pix.qrCodeUrl}
                      alt="QR Code PIX"
                      style={{ marginBottom: 16 }}
                    />
                    <Typography
                      variant="body2"
                      textAlign={'center'}
                      color="white"
                      sx={{
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                      }}
                    >
                      {pix.qrCode}
                    </Typography>
                    <Button
                      style={{ marginTop: 12 }}
                      variant="contained"
                      onClick={handleCopy}
                    >
                      Copiar código
                    </Button>
                  </div>
                )}
              </div>
            )}
            {paymentMethod === 'card' && (
              <div style={{ marginTop: '20px' }}>
                <StepTitle>Dados do Cartão</StepTitle>

                <form autoComplete="off">
                  <TextField
                    select
                    label="Parcelas"
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                  >
                    {[1, 2].map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}x de R${' '}
                        {(lot?.amount *
                          formData.athletes.length *
                          (1 + (7 + time) / 100)) /
                          100 /
                          time}{' '}
                        - R${' '}
                        {(lot?.amount *
                          formData.athletes.length *
                          (1 + (7 + time) / 100)) /
                          100}
                      </MenuItem>
                    ))}
                  </TextField>
                  <InputMask
                    mask="9999 9999 9999 9999"
                    value={cardData.number}
                    autoComplete="cc-number"
                    onChange={(e) =>
                      setCardData((prev) => ({
                        ...prev,
                        number: normalizeCardNumber(e.target.value),
                      }))
                    }
                    onFocus={(e) =>
                      setCardData((prev) => ({ ...prev, focus: e.target.name }))
                    }
                  >
                    {(inputProps) => (
                      <TextField
                        {...inputProps}
                        name="number"
                        label="Número do Cartão"
                        fullWidth
                        margin="normal"
                      />
                    )}
                  </InputMask>

                  <TextField
                    id="holder_name"
                    name="holder_name"
                    label="Nome no Cartão"
                    fullWidth
                    margin="normal"
                    autoComplete="cc-name"
                    placeholder="Nome completo"
                    onChange={handleInputChange}
                    value={cardData.holder_name}
                  />

                  <InputMask
                    mask="999.999.999-99"
                    value={cardData.holder_document}
                    onChange={(e) => handleHolderDocumentChange(e.target.value)}
                  >
                    {(inputProps) => (
                      <TextField
                        {...inputProps}
                        id="holder_document"
                        name="holder_document"
                        label="CPF do Comprador"
                        fullWidth
                        margin="normal"
                        placeholder="Digite o CPF"
                        autoComplete="off"
                        error={!!errors.holder_document}
                        helperText={errors.holder_document}
                      />
                    )}
                  </InputMask>
                  <div style={{ flex: 'row' }}>
                    <InputMask
                      mask="99"
                      value={cardData.exp_month}
                      onChange={(e) =>
                        setCardData((prev) => ({
                          ...prev,
                          exp_month: e.target.value,
                        }))
                      }
                      onFocus={(e) =>
                        setCardData((prev) => ({
                          ...prev,
                          focus: e.target.name,
                        }))
                      }
                    >
                      {(inputProps) => (
                        <TextField
                          {...inputProps}
                          name="exp_month"
                          label="Mes de Expiração"
                          fullWidth
                          margin="normal"
                        />
                      )}
                    </InputMask>
                    <InputMask
                      mask="99"
                      value={cardData.exp_year}
                      onChange={(e) =>
                        setCardData((prev) => ({
                          ...prev,
                          exp_year: e.target.value,
                        }))
                      }
                      onFocus={(e) =>
                        setCardData((prev) => ({
                          ...prev,
                          focus: e.target.name,
                        }))
                      }
                    >
                      {(inputProps) => (
                        <TextField
                          {...inputProps}
                          name="exp_year"
                          label="Ano de Expiração"
                          fullWidth
                          margin="normal"
                        />
                      )}
                    </InputMask>
                  </div>
                  <InputMask
                    mask="9999"
                    value={cardData.cvv}
                    onChange={(e) =>
                      setCardData((prev) => ({
                        ...prev,
                        cvv: e.target.value,
                      }))
                    }
                    onFocus={(e) =>
                      setCardData((prev) => ({ ...prev, focus: e.target.name }))
                    }
                  >
                    {(inputProps) => (
                      <TextField
                        {...inputProps}
                        name="cvv"
                        label="CVV"
                        fullWidth
                        margin="normal"
                      />
                    )}
                  </InputMask>
                </form>

                <StepTitle style={{ marginTop: 20, marginBottom: 12 }}>
                  Endereço de Cobrança
                </StepTitle>

                <InputMask
                  mask="99999-999"
                  value={cardData.billing_address?.zip_code || ''}
                  onChange={(e) =>
                    handleAddressChange('zip_code', e.target.value)
                  }
                  onBlur={(e) =>
                    fetchAddressByZipCode(e.target.value.replace(/\D/g, ''))
                  }
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      label="CEP"
                      fullWidth
                      margin="normal"
                      placeholder="Digite o CEP"
                      error={!!errors.zip_code}
                      InputProps={{
                        endAdornment: loadingCep && (
                          <CircularProgress
                            size={20}
                            style={{ marginRight: '8px' }}
                          />
                        ),
                      }}
                      helperText={errors.zip_code}
                    />
                  )}
                </InputMask>
                <TextField
                  label="Endereço"
                  value={cardData.billing_address?.line_1 || ''}
                  onChange={(e) =>
                    handleAddressChange('line_1', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Número"
                  value={cardData.billing_address?.line_2 || ''}
                  onChange={(e) =>
                    handleAddressChange('line_2', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Cidade"
                  value={cardData.billing_address?.city || ''}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Estado"
                  value={cardData.billing_address?.state || ''}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="País"
                  value={cardData.billing_address?.country || ''}
                  onChange={(e) =>
                    handleAddressChange('country', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
              </div>
            )}

            {!paymentMethod && (
              <Typography variant="body2" color="error">
                Por favor, selecione um método de pagamento.
              </Typography>
            )}
          </StepDiv>
        )}

        {currentStep === 3 && (
          <StepDiv
            style={{
              flex: 1,
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: 24,
            }}
          >
            <Lottie
              options={{
                loop: false,
                autoplay: true,
                animationData: animationData,
                rendererSettings: {
                  preserveAspectRatio: 'xMidYMid slice',
                },
              }}
              height={200}
              width={200}
            />
            <StepTitle style={{ marginTop: 20 }}>
              Inscrição realizada!
            </StepTitle>
          </StepDiv>
        )}
        {currentStep !== 3 && (
          <div style={{ marginTop: '24px' }}>
            {currentStep > 0 && (
              <Button
                onClick={handlePreviousStep}
                style={{ marginRight: '8px' }}
              >
                Voltar
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNextStep}>
                Próximo
              </Button>
            ) : null}

            {currentStep === 2 && (
              <LoadingButton
                variant="contained"
                loading={loading}
                onClick={
                  paymentMethod === 'pix' ? handleConfirmPayment : handlePayment
                }
                disabled={loading}
              >
                {paymentMethod === 'pix' ? 'Já paguei' : 'Concluir'}
              </LoadingButton>
            )}
          </div>
        )}
      </Content>
    </Container>
  );
};
