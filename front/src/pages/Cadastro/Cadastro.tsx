import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Link } from "react-router-dom"

type Usuario = {
  nome: string
  login: string
  senha: string
}

const baseURL = 'http://localhost:5000'

export default function Cadastro() {
  const [novoUsuario, setNovoUsuario] = useState<Usuario>({} as Usuario)

  const criarUsuario = async () => {
    try {
      fetch(baseURL + '/usuarios.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(novoUsuario)
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);
      })
      .catch(error => {
          console.error('Erro ao criar usuario:', error);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen flex dark:bg-slate-800">
      <Card className="m-auto max-w-sm bg-white">
        <CardHeader>
          <CardTitle className="text-xl">Cadastro</CardTitle>
          <CardDescription>
            Insira seus dados para criar uma conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input 
                value={novoUsuario.nome} 
                onChange={(e) => setNovoUsuario((previous) => ({...previous, nome: e.target.value}))} 
                id="name" 
                placeholder="Insira seu nome" 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="login">Login</Label>
              <Input
                value={novoUsuario.login} 
                onChange={(e) => setNovoUsuario((previous) => ({...previous, login: e.target.value}))} 
                id="login"
                placeholder="Insira seu nome de usuário"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password"
                value={novoUsuario.senha} 
                onChange={(e) => setNovoUsuario((previous) => ({...previous, senha: e.target.value}))} 
                type="password"
                placeholder="Insira sua senha" 
              />
            </div>
            <Button onClick={criarUsuario} variant="outline" type="submit" className="w-full">
              Cadastrar
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Link to="/login" className="underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
