import { format, isValid } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Atividade = {
  id: number;
  titulo: string;
  id_usuario: number;
  data_criacao: string;
  data_conclusao: string;
  descricao: string;
  status: string;
};

type Usuario = {
  id: number;
  login: string;
  nome: string;
  sobrenome: string;
  data_nascimento: string;
};

const baseURL = "http://localhost:5000";

function Gestor() {
  const [usuario, setUsuario] = useState<Usuario>();
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [novaAtividade, setNovaAtividade] = useState<Atividade>(
    {} as Atividade
  );
  const [atividadeEmEdicao, setAtividadeEmEdicao] = useState<Atividade>(
    {} as Atividade
  );
  const [idAtividadeEmDelecao, setIdAtividadeEmDelecao] = useState<number>(0);
  const [atividadesAtrasadas, setAtividadesAtrasadas] = useState<Atividade[]>(
    []
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  const editarAtividade = (atividade: Atividade) => {
    setAtividadeEmEdicao(atividade);
  };

  const fetchAtividades = async (mostrarAtrasadas?: boolean) => {
    try {
      const cookie = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("token="));
      if (!cookie) {
        throw new Error("Token não encontrado no cookie");
      }
      const token = cookie.split("=")[1];

      const response = await fetch(baseURL + "/atividades.php", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar as atividades");
      }
      const data = await response.json();
      setAtividades(data);

      if (mostrarAtrasadas) {
        const atividadesAtrasadas = data.filter(
          (atividade: Atividade) =>
            new Date(atividade.data_conclusao) < new Date()
        );
        if (atividadesAtrasadas.length > 0) {
          setAtividadesAtrasadas(atividadesAtrasadas);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const criarAtividade = async () => {
    try {
      const cookie = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("token="));
      if (!cookie) {
        throw new Error("Token não encontrado no cookie");
      }
      const token = cookie.split("=")[1];

      const response = await fetch(baseURL + "/atividades.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novaAtividade),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar atividade");
      }

      await response.json();

      setNovaAtividade({} as Atividade);
      fetchAtividades();
    } catch (error) {
      console.error("Erro ao criar atividade:", error);
    }
  };

  const deletarAtividade = async (id: number) => {
    try {
      const cookie = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("token="));
      if (!cookie) {
        throw new Error("Token não encontrado no cookie");
      }
      const token = cookie.split("=")[1];

      const response = await fetch(`${baseURL}/atividades.php?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir a atividade");
      }

      fetchAtividades();
    } catch (error) {
      console.error("Erro ao excluir atividade:", error);
    }
  };

  const atualizarAtividade = async () => {
    try {
      const cookie = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("token="));
      if (!cookie) {
        throw new Error("Token não encontrado no cookie");
      }
      const token = cookie.split("=")[1];

      const response = await fetch(`${baseURL}/atividades.php`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(atividadeEmEdicao),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar atividade");
      }

      await response.json();
      fetchAtividades();
    } catch (error) {
      console.error("Erro ao atualizar atividade:", error);
    }
  };

  const marcarAtividadeConcluida = async (id: number) => {
    try {
      const cookie = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("token="));
      if (!cookie) {
        throw new Error("Token não encontrado no cookie");
      }
      const token = cookie.split("=")[1];

      const response = await fetch(`${baseURL}/atividades.php`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status: "concluído" }),
      });

      if (!response.ok) {
        throw new Error("Erro ao marcar a atividade como concluída");
      }

      await response.json();
      fetchAtividades();
    } catch (error) {
      console.error("Erro ao marcar a atividade como concluída:", error);
    }
  };

  async function fetchUsuario() {
    try {
      const cookie = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("token="));
      if (!cookie) {
        throw new Error("Token não encontrado no cookie");
      }
      const token = cookie.split("=")[1];
      if (!token) return
      const response = await fetch("http://localhost:5000/usuarios.php", {
        headers: {
          Authorization: token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsuario(data);
      } else {
        console.error("Erro ao buscar nome do usuário:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao buscar nome do usuário:", error);
    }
  }


  useEffect(() => {
    fetchAtividades(true);
    fetchUsuario()
  }, []);

  const formatarData = (data: string): string => {
    const parsedDate = new Date(data);

    // Verifica se a data é válida
    if (isValid(parsedDate)) {
      return format(parsedDate, "dd/MM/yyyy");
    }

    return ''
  };

  return (
    <>
      <nav
        style={{ height: "10vh" }}
        className="navbar navbar-expand-lg navbar-light bg-light justify-content-between"
      >
        <a className="navbar-brand" href="#">
          Gestor de Atividades
        </a>
        <div>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <button
                className="btn btn-link nav-link"
                data-toggle="modal"
                data-target="#myModalCreditos"
              >
                Créditos
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={handleLogout}>
                Logout
              </button>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-link nav-link d-flex items-center"
              >
                {usuario?.nome}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-person-circle ml-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div
        style={{ height: "90vh" }}
        className="d-flex justify-content-center align-items-center bg-dark"
      >
        <div className="container" style={{ width: "80%" }}>
          <table className="table table-light table-striped">
            <thead className="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Título</th>
                <th scope="col">Descrição</th>
                <th scope="col">Status</th>
                <th scope="col">Data de criação</th>
                <th scope="col">Data de conclusão</th>
                <th scope="col" style={{ width: "15%" }}>
                  Operações
                </th>
              </tr>
            </thead>
            <tbody id="atividades">
              {atividades.map((atividade) => (
                <tr
                  style={{
                    backgroundColor:
                      atividade.status === "concluído"
                        ? "#dff0d8" // Verde
                        : new Date(atividade.data_conclusao) < new Date()
                        ? "#f2dede" // Vermelho
                        : "",
                  }}
                  key={atividade.id}
                >
                  <th scope="row">{atividade.id}</th>
                  <td id="content${atividade.index}">{atividade.titulo}</td>
                  <td id="content${atividade.index}">{atividade.descricao}</td>
                  <td>{atividade.status}</td>
                  <td>{formatarData(atividade.data_criacao)}</td>
                  <td>{formatarData(atividade.data_conclusao)}</td>
                  <td className="text-center">
                    <button
                      data-toggle="modal"
                      data-target="#myModalEditar"
                      className="btn edit"
                      onClick={() => editarAtividade(atividade)}
                    >
                      <i
                        className="fa-solid fa-file-pen"
                        style={{ color: "blue" }}
                      ></i>
                    </button>
                    <button
                      data-toggle="modal"
                      data-target="#myModalDeletar"
                      className="btn delete"
                      onClick={() => setIdAtividadeEmDelecao(atividade.id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                    <button
                      onClick={() => marcarAtividadeConcluida(atividade.id)}
                      className="btn done"
                      id="done${atividade.index}"
                    >
                      <i
                        className="fa-solid fa-check"
                        style={{ color: "green" }}
                      ></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot style={{ borderTop: "2px solid black" }}>
              <tr>
                <td className="text-center" scope="row" colSpan={12}>
                  <button
                    data-toggle="modal"
                    data-target="#myModalCriar"
                    className="btn add"
                    id="add"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div id="myModalDeletar" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="deleteAtividade"></h4>
            </div>
            <div className="modal-body">
              <input type="hidden" id="rowDelete" />
              <p>Confirmar exclusão?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary btn-deletar-nao"
                data-dismiss="modal"
              >
                Não
              </button>
              <button
                id="confirmDelete"
                type="button"
                className="btn btn-primary btn-deletar-sim"
                data-dismiss="modal"
                onClick={() => deletarAtividade(idAtividadeEmDelecao)}
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="myModalEditar" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Modificar Atividade</h4>
            </div>
            <div className="modal-body d-flex justify-content-center">
              <form style={{ width: "26rem" }}>
                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor="titulo">
                    Título
                  </label>
                  <input
                    value={atividadeEmEdicao?.titulo || ""}
                    onChange={(e) =>
                      setAtividadeEmEdicao((previous) => ({
                        ...previous,
                        titulo: e.target.value,
                      }))
                    }
                    type="text"
                    className="form-control"
                  />
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor="data_conclusao">
                    Data de Conclusão
                  </label>
                  <input
                    type="date"
                    id="data_conclusao"
                    className="form-control"
                    value={atividadeEmEdicao?.data_conclusao || ""}
                    onChange={(e) =>
                      setAtividadeEmEdicao((previous) => ({
                        ...previous,
                        data_conclusao: e.target.value,
                      }))
                    }
                  />
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor="form4Example3">
                    Descrição
                  </label>
                  <textarea
                    className="form-control"
                    id="form4Example3"
                    rows={4}
                    value={atividadeEmEdicao?.descricao || ""}
                    onChange={(e) =>
                      setAtividadeEmEdicao((previous) => ({
                        ...previous,
                        descricao: e.target.value,
                      }))
                    }
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                id="atualizar"
                type="button"
                className="btn btn-primary btn-editar"
                data-dismiss="modal"
                onClick={() => atualizarAtividade()}
              >
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="myModalCriar" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Nova Atividade</h4>
            </div>
            <div className="modal-body d-flex justify-content-center">
              <form style={{ width: "26rem" }}>
                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor="titulo">
                    Título
                  </label>
                  <input
                    value={novaAtividade.titulo}
                    onChange={(e) =>
                      setNovaAtividade((previous) => ({
                        ...previous,
                        titulo: e.target.value,
                      }))
                    }
                    type="text"
                    id="titulo"
                    className="form-control"
                  />
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor="data_conclusao">
                    Data de Conclusão
                  </label>
                  <input
                    type="date"
                    id="data_conclusao"
                    className="form-control"
                    value={novaAtividade.data_conclusao}
                    onChange={(e) =>
                      setNovaAtividade((previous) => ({
                        ...previous,
                        data_conclusao: e.target.value,
                      }))
                    }
                  />
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor="form4Example3">
                    Descrição
                  </label>
                  <textarea
                    className="form-control"
                    id="form4Example3"
                    rows={4}
                    value={novaAtividade.descricao}
                    onChange={(e) =>
                      setNovaAtividade((previous) => ({
                        ...previous,
                        descricao: e.target.value,
                      }))
                    }
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                id="criar"
                type="button"
                className="btn btn-primary btn-criar"
                data-dismiss="modal"
                onClick={criarAtividade}
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="myModalCreditos" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Créditos</h4>
            </div>
            <div className="modal-body d-flex justify-content-center">
              <ul>
                <li>Breno Mazzini Costa</li>
                <li>Felipe Barreto Pereira</li>
                <li>Luiz Felipe Barbosa Arruda</li>
                <li>Mariana</li>
                <li>Millena Netto Souza</li>
                <li>Rafael Ramiro Claro</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`modal fade ${atividadesAtrasadas.length ? "show" : ""}`}
        style={{ display: atividadesAtrasadas.length ? "block" : "none" }}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">
                Atividades Atrasadas
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => setAtividadesAtrasadas([])}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {atividadesAtrasadas.map((atividade, index) => (
                <div key={index}>
                  <p>
                    {atividade.id} - {atividade.titulo}
                  </p>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => setAtividadesAtrasadas([])}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Gestor;
