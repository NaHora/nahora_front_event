import styled, { keyframes } from "styled-components";

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
 
  80% {
    opacity: 0.9;
  }
  100% {
    opacity: 0;
  }
`;

export const Container = styled.div`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;

  color: #f5f5f5;
`;

export const EventImage = styled.img``;

export const Content = styled.div`
  background: #29282e;
  padding: 18px 14px;
  border-radius: 8px;
  max-width: 1120px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .show {
    animation: ${fadeOut} 5.1s ease-out;
  }

  .hide {
  }
`;

export const CategoryTitle = styled.h1`
  color: #f5f5f5;
  font-size: 40px;
`;

export const TableContainer = styled.div`
  background-color: #29282e;
`;

export const Table = styled.table`
  border-spacing: 0 18px;

  width: 100%;
`;

export const Tbody = styled.tbody``;

export const Thead = styled.thead`
  border-spacing: 0px;
  border: 0;
`;

export const Tr = styled.tr`
  background-color: #313037;
  box-shadow: 0px 4px 9px #121214, inset 0px -17px 32px #121214,
    inset 0px 17px 32px #121214;
`;

export const Th = styled.th`
  background-color: #121214;
  padding: 16px 0;
  font-weight: 700;

  font-size: 16px;
`;

export const Td = styled.td`
  padding: 16px 0;
  transform: skew(10deg);
`;

export const Position = styled.span`
  font-weight: 800;
  font-size: 24px;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

export const FlexColumnAlignStart = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const PairName = styled.span`
  font-weight: 800;
  font-size: 16px;
`;
export const CompetitorsName = styled.span`
  font-weight: 400;
  font-size: 14px;
  margin-top: 4px;
`;
export const WorkoutName = styled.span`
  font-weight: 400;
  font-size: 14px;
  color: #f50057;
`;

export const Point = styled.span`
  font-weight: 800;
  margin-top: 8px;
  font-size: 18px;
`;

export const Total = styled.div`
  font-weight: 900;
  font-size: 24px;
  background-color: #ef144d;
  padding: 8px 12px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
