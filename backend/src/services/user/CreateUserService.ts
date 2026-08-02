interface CreateUserProps{
    name: string;
    email: string;
    password: string;
}

class CreateUserService{
    async execute({name, email, password}: CreateUserProps){
        console.log({name, email, password});

        return `Usuário ${name} criado com sucesso!`;
    }
}

export { CreateUserService }