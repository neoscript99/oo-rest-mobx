import styled from 'styled-components';

export const LoginPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin: 0;
  min-height: 10em;
  height: 100vh;
  color: #888;
  line-height: 1.75;
  padding-top: 8rem;
`;

export const LoginBox = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  background-color: rgba(255, 255, 255, 0.77);
  border-radius: 0.25em;
  overflow: hidden;
  margin: 0 auto 0;
  box-shadow: 0 0 30px -5px rgba(0, 0, 0, 0.5);
`;

export const LoginBoxItem = styled.div`
  width: 25em;
  background-color: #fff;
  padding: 2em;
`;

export const LoginBoxTitle = styled.h1`
  font-weight: 300;
  font-size: 1.75em;
  color: #133e40;
  margin-top: 0;
`;
