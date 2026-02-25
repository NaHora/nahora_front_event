import { useEffect, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import Navbar from '../../components/navbar';
import api from '../../services/api';
import { getFormatDate } from '../../utils/date';
import {
  Container,
  Content,
  Header,
  Table,
  TableContainer,
  Td,
  Th,
  Thead,
  Tr,
  WithdrawForm,
} from './styles';

interface StatementOperation {
  id?: string;
  type?: string;
  status?: string;
  description?: string;
  amount?: number;
  created_at?: string;
}

export const RecipientStatement = () => {
  const [loading, setLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [amount, setAmount] = useState('');
  const [operations, setOperations] = useState<StatementOperation[]>([]);

  const getStatement = async () => {
    setLoading(true);
    try {
      const response = await api.get('/enterprises/recipient/statement', {
        params: { page: 1, size: 100 },
      });

      if (Array.isArray(response.data?.data)) {
        setOperations(response.data.data);
      } else if (Array.isArray(response.data)) {
        setOperations(response.data);
      } else {
        setOperations([]);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Erro ao carregar extrato do recebedor.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStatement();
  }, []);

  const handleWithdraw = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedAmount = Number(amount.replace(',', '.'));

    if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Informe um valor de saque válido.');
      return;
    }

    setWithdrawing(true);
    try {
      await api.post('/enterprises/recipient/withdraw', {
        amount: parsedAmount,
      });

      toast.success('Solicitação de saque criada com sucesso.');
      setAmount('');
      getStatement();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao solicitar saque.');
    } finally {
      setWithdrawing(false);
    }
  };

  const totalAmount = useMemo(() => {
    return operations.reduce((sum, operation) => {
      const current = Number(operation.amount || 0);
      return sum + (Number.isNaN(current) ? 0 : current);
    }, 0);
  }, [operations]);

  const formatCurrencyFromCents = (value?: number): string => {
    const raw = Number(value || 0);
    const amountValue = Number.isNaN(raw) ? 0 : raw / 100;

    return amountValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <Container>
      <Navbar />

      <Content>
        <Header>
          <Typography variant="h5" fontWeight={700}>
            Extrato do recebedor
          </Typography>
          <Typography variant="body1">
            Total no período carregado: {formatCurrencyFromCents(totalAmount)}
          </Typography>
        </Header>

        <WithdrawForm onSubmit={handleWithdraw}>
          <TextField
            label="Valor do saque (R$)"
            type="number"
            size="small"
            value={amount}
            onChange={event => setAmount(event.target.value)}
            inputProps={{ min: 0, step: '0.01' }}
            sx={{ minWidth: 220 }}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={withdrawing}
          >
            {withdrawing ? 'Solicitando...' : 'Sacar'}
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={getStatement}
            disabled={loading}
          >
            Atualizar extrato
          </Button>
        </WithdrawForm>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>Tipo</Th>
                  <Th>Status</Th>
                  <Th>Valor</Th>
                  <Th>Data</Th>
                  <Th>Descrição</Th>
                </Tr>
              </Thead>
              <tbody>
                {operations.length === 0 && (
                  <Tr>
                    <Td colSpan={5}>Nenhuma movimentação encontrada.</Td>
                  </Tr>
                )}

                {operations.map(operation => (
                  <Tr key={operation.id || `${operation.type}-${operation.created_at}`}>
                    <Td>{operation.type || '-'}</Td>
                    <Td>{operation.status || '-'}</Td>
                    <Td>{formatCurrencyFromCents(operation.amount)}</Td>
                    <Td>
                      {operation.created_at
                        ? getFormatDate(
                            new Date(operation.created_at),
                            'dd/MM/yyyy HH:mm',
                          )
                        : '-'}
                    </Td>
                    <Td>{operation.description || '-'}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        )}
      </Content>
    </Container>
  );
};
