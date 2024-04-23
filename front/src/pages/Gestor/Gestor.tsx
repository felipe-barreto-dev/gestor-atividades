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

const baseURL = "http://localhost:5000";

function Gestor() {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [novaAtividade, setNovaAtividade] = useState<Atividade>(
    {} as Atividade
  );
  const [atividadeEmEdicao, setAtividadeEmEdicao] = useState<Atividade>(
    {} as Atividade
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpar o cookie de autenticação
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirecionar para a página de login
    navigate("/login");
  };

  const editarAtividade = (atividade: Atividade) => {
    setAtividadeEmEdicao(atividade);
  };

  const fetchAtividades = async () => {
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

      const data = await response.json();

      alert(data.mensagem);
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

      alert("Atividade excluída com sucesso");
      fetchAtividades(); // Atualize a lista de atividades após a exclusão
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

      const data = await response.json();
      alert(data.mensagem);
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

      const data = await response.json();
      alert(data.mensagem);
      fetchAtividades();
    } catch (error) {
      console.error("Erro ao marcar a atividade como concluída:", error);
    }
  };

  useEffect(() => {
    fetchAtividades();
  }, []);

  return (
    <>
      <nav
        style={{ height: "10vh" }}
        className="navbar navbar-expand-lg navbar-light bg-light"
      >
        <a className="navbar-brand" href="#">
          Navbar
        </a>
        <div>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div
        style={{ height: "90vh" }}
        className="d-flex justify-content-center align-items-center bg-dark"
      >
        {/* <div className="alert alert-success" role="alert">
          A simple success alert—check it out!
        </div>
        <button
          data-toggle="modal"
          data-target="#myModalCreditos"
          className="btn add"
          id="add"
        >
          <i className="fa-solid fa-plus"></i>
        </button> */}
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
                  <td>{atividade.data_criacao}</td>
                  <td>{atividade.data_conclusao}</td>
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
                            onClick={() => deletarAtividade(atividade.id)}
                          >
                            Sim
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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
                <li>Breno</li>
                <li>Felipe</li>
                <li>Luiz</li>
                <li>Mariana</li>
                <li>Millena</li>
                <li>Rafael</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Gestor;
