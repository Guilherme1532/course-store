const forgotPasswordTemplate = ({ name, otp }) => {
  return `
    <div>
        <h1>Olá ${name}!</h1>
        <p>Você solicitou a redefinição de sua senha. Por favor, use o seguinte código para redefini-la:</p>
            <div style = "font-family: "Arial"; word-spacing: 5px;;background-color: red; color: black; padding: 20px; text-align: center; font-size: 20px; font-weight: 800;">
                ${otp}
            </div>
        <p>O codigo é valido por 30 minutos, insira o codigo em nosso site para prosseguir com a redefinição de sua senha!</p>
        <br/>
        </br>
        <p>Obrigado</p>
        <p>Equipe Market</p>
    </div>
    `;
};

export default forgotPasswordTemplate;
