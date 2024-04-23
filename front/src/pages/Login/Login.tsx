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
          'Content-Type': 'application/json',
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

      navigate('/gestor');
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error);
    }
  };

  return (
    <div className="signup template d-flex justify-content-center align-items-center vh-100 bg-primary">
      <div className="50-w p-5 rounded bg-white">
        <form onSubmit={(e) => e.preventDefault()}>
          <h3 className="text-center">Entrar</h3>
          <div className="mb-2">
            <label htmlFor="login">Login</label>
            <input 
              value={login} 
              onChange={(e) => setLogin(e.target.value)}
              type="text" 
              className="form-control" 
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password">Senha</label>
            <input
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              type="password" 
              className="form-control" 
            />
          </div>
          <div className="d-grid">
            <button onClick={autenticar} className="btn btn-primary">Entrar</button>
          </div>
          <p className="text-end mt-2">
            <Link to="/cadastro">Cadastrar</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
