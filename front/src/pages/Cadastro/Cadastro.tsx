import { useState } from "react";
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";

type Usuario = {
  nome: string;
  sobrenome: string;
  data_nascimento: string;
  login: string;
  senha: string;
};

const baseURL = "http://localhost:5000";

export default function Cadastro() {
  const navigate = useNavigate();
  const [novoUsuario, setNovoUsuario] = useState<Usuario>({} as Usuario);

  const criarUsuario = async () => {
    try {
      const response = await fetch(baseURL + '/usuarios.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoUsuario)
      });

      if (!response.ok) {
        throw new Error('Falha na criação de usuário');
      }

      alert(`Usuário ${novoUsuario.login} criado com sucesso`)

      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login template d-flex justify-content-center align-items-center vh-100 bg-primary">
      <div className="50-w p-5 rounded bg-white">
        <form onSubmit={(e) => e.preventDefault()}>
          <h3 className="text-center">Cadastrar</h3>
          <div className="mb-2">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              value={novoUsuario.nome}
              onChange={(e) =>
                setNovoUsuario((previous) => ({
                  ...previous,
                  nome: e.target.value,
                }))
              }
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="sobrenome">Sobrenome</label>
            <input
              value={novoUsuario.sobrenome}
              onChange={(e) =>
                setNovoUsuario((previous) => ({
                  ...previous,
                  sobrenome: e.target.value,
                }))
              }
              type="text"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="data_nascimento">Data de Nascimento</label>
            <input
              value={novoUsuario.data_nascimento}
              onChange={(e) =>
                setNovoUsuario((previous) => ({
                  ...previous,
                  data_nascimento: e.target.value,
                }))
              }
              type="date"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="login">Login</label>
            <input
              value={novoUsuario.login}
              onChange={(e) =>
                setNovoUsuario((previous) => ({
                  ...previous,
                  login: e.target.value,
                }))
              }
              type="text"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password">Senha</label>
            <input
              value={novoUsuario.senha}
              onChange={(e) =>
                setNovoUsuario((previous) => ({
                  ...previous,
                  senha: e.target.value,
                }))
              }
              type="password"
              className="form-control"
            />
          </div>
          <div className="d-grid">
            <button onClick={criarUsuario} className="btn btn-primary">
              Cadastrar
            </button>
          </div>
          <p className="text-end mt-2">
            Já possui uma conta?
            <Link className="ml-2" to="/login">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
