const verifyEmailTemplate = (name, link) => {
  return `
        <div>
        <h1>Olá ${name}!</h1>
        <p>
            Obrigado por se registrar em nosso site. Por favor, clique no link abaixo para verificar seu email:
        </p>
        <a href=${link}>${link}</a>
        </div>
    `;
};

export default verifyEmailTemplate;
