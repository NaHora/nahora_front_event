import styled, { keyframes } from 'styled-components';

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
  max-width: 1120px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -40px;

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
  border-collapse: collapse;

  border-spacing: 0;

  > tbody > tr:first-child {
    background-color: #29282e;
  }

  > thead {
    /* border: 2px solid #ef144d !important; */
    border: 2px solid #f04c12 !important;
  }
`;

export const Tbody = styled.tbody``;

export const Thead = styled.thead`
  border-spacing: 0px 18px;
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
    background-color: #f04c12;
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
    background-color: #f04c12;
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

  @media only screen and (max-width: 768px) {
    margin-top: 20px;
  }
`;

export const Board = styled.div`
  background-color: #29282e;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;

  @media only screen and (max-width: 768px) {
    padding: 12px;
    max-width: 100%;
  }
`;

export const LotsBoard = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  text-align: center;
  margin-bottom: 20px;

  @media only screen and (max-width: 768px) {
    padding: 12px;
    max-width: 100%;
  }
`;

export const CategoryAndShirtsContainer = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  text-align: center;

  @media only screen and (max-width: 768px) {
    padding: 12px;
    max-width: 100%;
  }
`;

export const LotsContainer = styled.div`
  gap: 24px;
`;

export const CategoryContainer = styled.div`
  background-color: #121212;
  border-radius: 10px;
  gap: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  text-align: center;
  padding: 12px;

  @media only screen and (max-width: 768px) {
    padding: 12px;
    max-width: 100%;
  }
`;
export const ShirtsContainer = styled.div`
  background-color: #121212;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  text-align: center;
  padding: 12px;
  width: 100%;
`;

export const CardsGroup = styled.div`
  background-color: #121212;
  display: flex;
  gap: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  text-align: center;
  padding: 12px;

  @media only screen and (max-width: 768px) {
    padding: 12px;
    max-width: 100%;
  }
`;

export const CardsCountainer = styled.div`
  background-color: #121212;
  border-radius: 10px;
  gap: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  text-align: center;
  padding: 12px;

  @media only screen and (max-width: 768px) {
    padding: 12px;
    max-width: 100%;
  }
`;

export const BoardShirts = styled.div`
  background-color: #121212;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;

  @media only screen and (max-width: 768px) {
    padding: 12px;
    max-width: 100%;
  }
`;

export const EventInformationsBoard = styled.div`
  border-radius: 10px;
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  gap: 16px;

  @media only screen and (max-width: 768px) {
    padding: 12px;
    max-width: 100%;
  }
`;
export const ShirtsInformationsBoard = styled.div`
  border-radius: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;

  @media only screen and (max-width: 768px) {
    padding: 12px;
    max-width: 100%;
  }
`;

export const CardInformation = styled.div`
  background: #121212;
  border-radius: 8px;
  padding: 16px;
  width: 160px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const CardTime = styled.div`
  background: #121212;
  border-radius: 8px;
  padding: 16px;
  width: 160px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const CardInformationHeader = styled.div`
  display: flex;
  gap: 16px;
`;

export const BoardTitle = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 20px;
`;
export const InformationTitle = styled.h2`
  color: #f04c12;
  font-size: 1.5rem;
  margin-bottom: 20px;
`;
export const ContentTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

export const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const Card = styled.div`
  background: #29282e;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  border: 1px solid #f04c12;
  width: 100%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const CategoryCard = styled.div`
  background: #29282e;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  border: 1px solid #f04c12;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const CardTitle = styled.h3`
  color: #f2f2f2;
  font-size: 16px;
  margin: 0;
`;

export const CardDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-size: 14px;
    color: #f2f2f2;
  }

  svg {
    color: #555;
    font-size: 18px;
  }
`;

export const Highlight = styled.span`
  color: #6a1b9a;
  font-weight: bold;
`;

export const TimeContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;
export const TimeDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TimeContainerTitle = styled.span`
  color: #f2f2f2;
  font-size: 24px;
  font-weight: bold;
`;
export const TimeContainerFooter = styled.span`
  color: #f2f2f2;
  font-size: 20px;
  font-weight: bold;
`;
export const TimeTitle = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #f2f2f2;
`;
export const TimeResult = styled.span`
  font-size: 32px;
  font-weight: bold;
  color: #f04c12;
`;
