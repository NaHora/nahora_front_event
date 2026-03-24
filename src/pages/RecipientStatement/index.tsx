import { useEffect, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { toast } from 'react-toastify';

import Navbar from '../../components/navbar';
import api from '../../services/api';
import { getFormatDate } from '../../utils/date';
import {
  Container,
  Content,
  DisclaimerBox,
  Header,
  HeaderEyebrow,
  HeaderSubtitle,
  StatusBadge,
  SummaryCard,
  SummaryDescription,
  SummaryGrid,
  SummaryLabel,
  SummaryValue,
  Table,
  TableContainer,
  Td,
  Th,
  Thead,
  Tr,
  WithdrawControls,
  WithdrawForm,
  WithdrawHint,
  WithdrawInfo,
  WithdrawMetaCard,
  WithdrawMetaGrid,
  WithdrawMetaLabel,
  WithdrawMetaText,
  WithdrawMetaValue,
} from './styles';

interface StatementOperation {
  id?: string;
  type?: string;
  status?: string;
  description?: string;
  amount?: number;
  created_at?: string;
}

interface RecipientBalance {
  available_amount?: number;
  waiting_funds_amount?: number;
  available?: { amount?: number };
  waiting_funds?: { amount?: number };
}

const WITHDRAWAL_FEE_CENTS = 357;

export const RecipientStatement = () => {
  const [loading, setLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [amount, setAmount] = useState('');
  const [availableBalance, setAvailableBalance] = useState(0);
  const [waitingFundsBalance, setWaitingFundsBalance] = useState(0);
  const [operations, setOperations] = useState<StatementOperation[]>([]);

  const formatCurrencyFromCents = (value?: number): string => {
    const raw = Number(value || 0);
    const amountValue = Number.isNaN(raw) ? 0 : raw / 100;

    return amountValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const loadRecipientData = async () => {
    setLoading(true);
    try {
      const [balanceResponse, withdrawalsResponse] = await Promise.all([
        api.get<RecipientBalance>('/enterprises/recipient/balance'),
        api.get('/enterprises/recipient/withdrawals', {
          params: { page: 1, size: 100 },
        }),
      ]);

      const balanceData = balanceResponse.data || {};
      setAvailableBalance(
        Number(
          balanceData.available_amount ?? balanceData.available?.amount ?? 0,
        ),
      );
      setWaitingFundsBalance(
        Number(
          balanceData.waiting_funds_amount ??
            balanceData.waiting_funds?.amount ??
            0,
        ),
      );

      if (Array.isArray(withdrawalsResponse.data?.data)) {
        setOperations(withdrawalsResponse.data.data);
      } else if (Array.isArray(withdrawalsResponse.data)) {
        setOperations(withdrawalsResponse.data);
      } else {
        setOperations([]);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Erro ao carregar dados do recebedor.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipientData();
  }, []);

  const totalAmount = useMemo(() => {
    return operations.reduce((sum, operation) => {
      const current = Number(operation.amount || 0);
      return sum + (Number.isNaN(current) ? 0 : current);
    }, 0);
  }, [operations]);

  const totalMappedBalance = useMemo(() => {
    return availableBalance + waitingFundsBalance;
  }, [availableBalance, waitingFundsBalance]);

  const withdrawalAmountCents = useMemo(() => {
    const normalized = amount
      .replace(/^R\$\s?/, '')
      .replace(/\./g, '')
      .replace(',', '.')
      .replace(/[^\d.]/g, '');
    const parsed = Number(normalized);

    if (!normalized || Number.isNaN(parsed) || parsed <= 0) {
      return 0;
    }

    return Math.round(parsed * 100);
  }, [amount]);

  const withdrawalNetCents = useMemo(() => {
    return Math.max(withdrawalAmountCents - WITHDRAWAL_FEE_CENTS, 0);
  }, [withdrawalAmountCents]);

  const canWithdraw = useMemo(() => {
    return (
      withdrawalAmountCents > WITHDRAWAL_FEE_CENTS &&
      withdrawalAmountCents <= availableBalance
    );
  }, [availableBalance, withdrawalAmountCents]);

  const getOperationTypeLabel = (value?: string) => {
    if (!value) return '-';

    const normalized = value.toLowerCase();

    if (normalized === 'credit') return 'Entrada';
    if (normalized === 'debit') return 'Saída';
    if (normalized === 'withdrawal') return 'Saque';
    return value;
  };

  const getStatusLabel = (value?: string) => {
    if (!value) return '-';

    const normalized = value.toLowerCase();
    if (normalized === 'pending') return 'Pendente';
    if (normalized === 'processing') return 'Processando';
    if (normalized === 'paid') return 'Pago';
    if (normalized === 'processed') return 'Processado';
    if (normalized === 'success') return 'Sucesso';
    if (normalized === 'failed') return 'Falhou';
    if (normalized === 'canceled') return 'Cancelado';

    return value;
  };

  const handleWithdraw = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedAmount = withdrawalAmountCents / 100;

    if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Informe um valor de saque válido.');
      return;
    }

    if (withdrawalAmountCents <= WITHDRAWAL_FEE_CENTS) {
      toast.error(
        `O valor do saque deve ser maior que a taxa de ${formatCurrencyFromCents(
          WITHDRAWAL_FEE_CENTS,
        )}.`,
      );
      return;
    }

    if (withdrawalAmountCents > availableBalance) {
      toast.error('O valor informado excede o saldo disponível para saque.');
      return;
    }

    setWithdrawing(true);
    try {
      await api.post('/enterprises/recipient/withdraw', {
        amount: parsedAmount,
      });

      toast.success('Solicitação de saque criada com sucesso.');
      setAmount('');
      loadRecipientData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao solicitar saque.');
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <Container>
      <Navbar />

      <Content>
        <Header>
          <HeaderEyebrow>Financeiro do evento</HeaderEyebrow>
          <Typography variant="h4" fontWeight={700}>
            Extrato do recebedor
          </Typography>
          <HeaderSubtitle>
            Acompanhe o saldo já liberado para saque, o valor que ainda está preso
            por cartão e o histórico das movimentações do recebedor.
          </HeaderSubtitle>
        </Header>

        <SummaryGrid>
          <SummaryCard $tone="available">
            <SummaryLabel>Saldo disponível</SummaryLabel>
            <SummaryValue>
              {formatCurrencyFromCents(availableBalance)}
            </SummaryValue>
            <SummaryDescription>
              Valor já liberado para solicitação de saque.
            </SummaryDescription>
          </SummaryCard>

          <SummaryCard $tone="waiting">
            <SummaryLabel>Preso no cartão</SummaryLabel>
            <SummaryValue>
              {formatCurrencyFromCents(waitingFundsBalance)}
            </SummaryValue>
            <SummaryDescription>
              Recebimentos ainda em processamento ou agenda de liberação.
            </SummaryDescription>
          </SummaryCard>

          <SummaryCard $tone="neutral">
            <SummaryLabel>Total mapeado</SummaryLabel>
            <SummaryValue>
              {formatCurrencyFromCents(totalMappedBalance)}
            </SummaryValue>
            <SummaryDescription>
              Soma do disponível com o valor retido no fluxo do cartão.
            </SummaryDescription>
          </SummaryCard>

          <SummaryCard $tone="withdraw">
            <SummaryLabel>Saques carregados</SummaryLabel>
            <SummaryValue>{formatCurrencyFromCents(totalAmount)}</SummaryValue>
            <SummaryDescription>
              Total das movimentações listadas no extrato atual.
            </SummaryDescription>
          </SummaryCard>
        </SummaryGrid>

        <WithdrawForm onSubmit={handleWithdraw}>
          <WithdrawInfo>
            <Typography variant="h6" fontWeight={700}>
              Solicitar saque
            </Typography>
            <WithdrawHint>
              Apenas o saldo disponível pode ser sacado agora. O valor preso no
              cartão será liberado conforme o fluxo de recebimento da operadora.
            </WithdrawHint>
          </WithdrawInfo>

          <WithdrawControls>
            <NumericFormat
              customInput={TextField}
              label="Valor do saque"
              size="small"
              fullWidth
              value={amount}
              onValueChange={({ formattedValue }) => setAmount(formattedValue)}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              prefix="R$ "
              placeholder="R$ 0,00"
            />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={withdrawing || !canWithdraw}
            >
              {withdrawing ? 'Solicitando...' : 'Sacar'}
            </Button>

            <Button
              variant="outlined"
              color="primary"
              onClick={loadRecipientData}
              disabled={loading}
            >
              Atualizar dados
            </Button>
          </WithdrawControls>

          <WithdrawMetaGrid>
            <WithdrawMetaCard $tone="fee">
              <WithdrawMetaLabel>Taxa do saque</WithdrawMetaLabel>
              <WithdrawMetaValue>
                {formatCurrencyFromCents(WITHDRAWAL_FEE_CENTS)}
              </WithdrawMetaValue>
              <WithdrawMetaText>
                Custo cobrado por solicitação de transferência.
              </WithdrawMetaText>
            </WithdrawMetaCard>

            <WithdrawMetaCard $tone="net">
              <WithdrawMetaLabel>Você recebe líquido</WithdrawMetaLabel>
              <WithdrawMetaValue>
                {formatCurrencyFromCents(withdrawalNetCents)}
              </WithdrawMetaValue>
              <WithdrawMetaText>
                Valor solicitado menos a taxa operacional do saque.
              </WithdrawMetaText>
            </WithdrawMetaCard>

            <WithdrawMetaCard $tone="warning">
              <WithdrawMetaLabel>Disponível para saque</WithdrawMetaLabel>
              <WithdrawMetaValue>
                {formatCurrencyFromCents(availableBalance)}
              </WithdrawMetaValue>
              <WithdrawMetaText>
                O saque só é liberado quando o valor supera a taxa e cabe no saldo
                disponível.
              </WithdrawMetaText>
            </WithdrawMetaCard>
          </WithdrawMetaGrid>

          <DisclaimerBox>
            Antes de sacar: existe uma taxa fixa de{' '}
            <strong>{formatCurrencyFromCents(WITHDRAWAL_FEE_CENTS)}</strong> por
            solicitação. Se quiser sacar <strong>{formatCurrencyFromCents(100)}</strong>,
            por exemplo, a taxa consome mais do que o valor pedido. Espere um valor
            que faça sentido financeiramente e confira o líquido antes de confirmar.
          </DisclaimerBox>
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
                    <Td>{getOperationTypeLabel(operation.type)}</Td>
                    <Td>
                      <StatusBadge $status={operation.status}>
                        {getStatusLabel(operation.status)}
                      </StatusBadge>
                    </Td>
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
