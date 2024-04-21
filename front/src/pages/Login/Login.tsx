import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const baseURL = 'http://localhost:5000'

export default function Login() {
  const navigate = useNavigate();

  const [login, setLogin] = useState<string>('')
  const [senha, setSenha] = useState<string>('')

  const autenticar = async () => {
    try {
      const response = await fetch(baseURL + '/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login, senha })
      });

      if (!response.ok) {
        throw new Error('Falha na autenticação');
      }

      const data = await response.json();
      const { token } = data;

      // Armazenar o token JWT em um cookie
      document.cookie = `token=${token}`;

      return navigate('/gestor');
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error);
    }
  };

  return (
    <div className="h-screen flex dark:bg-slate-800">
      <Card className="m-auto max-w-sm bg-white">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Preencha seu login para entrar com sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Login</Label>
            <Input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Nome de usuário" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input value={senha} onChange={(e) => setSenha(e.target.value)} id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button onClick={autenticar} variant="outline" className="w-full">Entrar</Button>
          <div className="mt-4 text-center text-sm">
            Ainda não tem uma conta?{" "}
            <Link to="/cadastro" className="underline">
              Cadastrar
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
