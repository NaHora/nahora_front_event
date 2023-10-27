import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  0% {
    opacity: 1;
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
  margin-bottom: 40px;

  .hide {
    animation: ${fadeOut} 100ms linear;
    opacity: 0;
  }
`;

export const SelectContent = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 120px);
  margin-bottom: 20px;
  justify-content: space-between;

  > div:first-child {
    margin-right: 18px;
  }
  > div:nth-child(2) {
    margin-left: 18px;
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    width: calc(100% - 20px);

    > div:first-child {
      margin-right: 0;
    }
    > div:nth-child(2) {
      margin-left: 0;
    }
  }
`;

export const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 20px;
`;

export const SelectTitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;

  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

export const SelectDiv = styled.div`
  width: 100%;
  padding-right: 12px;
  background-color: #121214;
  border-radius: 10px;
`;

export const Select = styled.select`
  border-radius: 10px;
  background-color: #121214;
  border: none;
  color: #fff;
  width: 100%;
  padding: 12px;

  ::placeholder {
    color: rgba(245, 245, 245, 0.3);
  }

  @media only screen and (max-width: 768px) {
    padding: 8px;
  }
`;

export const SelectOption = styled.option`
  background-color: #2e2e31;

  :hover {
    box-shadow: 0 0 10px 100px red inset;
  }
`;

export const WorkoutDiv = styled.div`
  width: calc(100% - 120px);
  box-shadow: 0px 4px 9px #121214, inset 0px -17px 32px #121214,
    inset 0px 17px 32px #121214;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px 16px 36px 16px;
  color: #f5f5f5;
  font-weight: 700;
  font-size: 24px;

  span:first-child {
    margin-bottom: 12px;
  }

  @media only screen and (max-width: 768px) {
    width: calc(100% - 20px);
  }
`;

export const WorkoutDescription = styled.span`
  font-weight: 400;
  margin-top: 4px;
  font-size: 16px;
  text-align: center;

  @media only screen and (max-width: 768px) {
    font-size: 14px;
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
  padding: 16px 8px;
  font-weight: 700;

  font-size: 16px;

  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

export const Td = styled.td`
  padding: 8px 8px;
  transform: skew(10deg);
`;

export const Position = styled.span`
  font-weight: 800;
  font-size: 24px;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
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

  @media only screen and (max-width: 768px) {
    font-size: 10px;
  }
`;
export const CompetitorsName = styled.span`
  font-weight: 400;
  font-size: 14px;
  margin-top: 4px;
  @media only screen and (max-width: 768px) {
    font-size: 9px;
  }
`;
export const WorkoutName = styled.span`
  font-weight: 400;
  font-size: 14px;
  color: #f04c12;
`;

export const Point = styled.span`
  font-weight: 800;
  margin-top: 8px;
  font-size: 18px;
`;

export const Score = styled.span`
  font-weight: 800;

  font-size: 20px;

  @media only screen and (max-width: 768px) {
    font-size: 10px;
  }
`;

export const Total = styled.div`
  font-weight: 900;
  font-size: 24px;
  /* background-color: #ef144d; */
  background-color: #f04c12;
  padding: 8px 12px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 768px) {
    font-size: 16px;
  }
`;

export const InputLabel = styled.h2`
  color: #f5f5f5;
  font-size: 14px;
  margin-bottom: 4px;
`;
