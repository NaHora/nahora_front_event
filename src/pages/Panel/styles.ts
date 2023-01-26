import styled, { keyframes } from "styled-components";

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
  padding: 40px;
  border-radius: 8px;
  max-width: 1120px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media only screen and (max-width: 768px) {
    padding: 12px;
  }
`;

export const ContentHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16px;

  @media only screen and (max-width: 768px) {
    width: calc(100% - 20px);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const FilteredContainer = styled.div`
  display: flex;

  > :first-child {
    margin-right: 24px;
  }

  @media only screen and (max-width: 768px) {
    width: calc(100% - 20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;

    > :first-child {
      margin-right: 0px;
      margin-bottom: 16px;
    }
  }
`;

export const FilteredSelect = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TableContainer = styled.div`
  width: 100%;
`;

export const SelectLabel = styled.span`
  font-weight: 700;
  font-size: 16px;
  color: #fff;
  margin-bottom: 12px;
`;

export const Table = styled.table`
  width: 100%;

  border-spacing: 0 18px;
`;

export const Tbody = styled.tbody``;

export const Thead = styled.thead`
  border: 2px solid #ef144d;
  border-spacing: 0px;
`;

export const Tr = styled.tr`
  background-color: #121214;
`;

export const Th = styled.th`
  background-color: #121214;
  padding: 16px 8px;
  font-weight: 700;
  width: 25%;
  font-size: 16px;
  text-align: left;

  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

export const Td = styled.td`
  padding: 8px 8px;
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

export const PairName = styled.span`
  font-weight: 400;
  font-size: 14px;

  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
export const Points = styled.span`
  font-weight: 400;
  font-size: 14px;

  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
export const TieBreak = styled.span`
  font-weight: 400;
  font-size: 14px;

  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
export const CompetitorsName = styled.span`
  font-weight: 400;
  font-size: 14px;
  margin-top: 4px;

  @media only screen and (max-width: 768px) {
    font-size: 10px;
  }
`;

export const Delete = styled.button`
  border: none;
  background: transparent;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s;

  :hover {
    background-color: #f50057;
    color: #fff;
  }
`;

export const Edit = styled.button`
  border: none;
  background: transparent;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s;

  :hover {
    background-color: #f50057;
    color: #fff;
  }
`;

export const Select = styled.select`
  background-color: transparent;
  border: none;
  color: rgba(245, 245, 245, 0.3);
  width: 100%;
`;

export const Input = styled.input`
  background-color: transparent;
  border: none;
  color: #fff;
  width: 100%;
  font-size: 14px;

  ::placeholder {
    color: #fff;
    font-size: 14px;
  }
`;

export const DrawerSelect = styled.select`
  background-color: transparent;
  border: none;
  color: #fff;
  width: 100%;
`;

export const SelectDiv = styled.div`
  width: 250px;
  padding: 12px;
  border-radius: 10px;
  background-color: #121214;
`;

export const DrawerSelectDiv = styled.div`
  width: 320px;
  padding: 12px;
  border-radius: 10px;
  background-color: #121214;
  margin-top: 40px;

  @media only screen and (max-width: 768px) {
    width: 240px;
  }
`;

export const DrawerContainer = styled.div`
  padding: 84px 62px;
  background-color: #29282e;
  flex: 1;

  @media only screen and (max-width: 768px) {
    padding: 40px 32px;
  }
`;

export const ResultForm = styled.div`
  width: 360px;

  @media only screen and (max-width: 768px) {
    width: 240px;
  }
`;

export const SelectOption = styled.option`
  color: black;
`;

export const DrawerTitle = styled.span`
  font-weight: 400;
  font-size: 16px;
  color: #fff;
`;

export const InputLabel = styled.h2`
  color: #f5f5f5;
  font-size: 14px;
  margin-top: 40px;
  margin-bottom: 4px;
`;
