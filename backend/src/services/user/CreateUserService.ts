class CreateUserService{
    async execute(){
        console.log("executando serviço");

        return "Usuário Wilker criado com sucesso !";
    }
}

export { CreateUserService }