import { useEffect, useState } from "react"

type Atividade = {
  id: number
  titulo: string
  id_usuario: number
  data_criacao: string
  data_resolucao: string
}

const baseURL = 'http://localhost:5000'

function App() {
  const [atividades, setAtividades] = useState<Atividade[]>([])

  const criarAtividade = async () => {
    try {
      const novaAtividade = {
        titulo: "Nova atividade",
        id_usuario: 1
      };

      fetch(baseURL + '/atividades.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(novaAtividade)
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);
      })
      .catch(error => {
          console.error('Erro ao criar atividade:', error);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchAtividades = async () => {
      try {
        const response = await fetch(baseURL + '/atividades.php');
        if (!response.ok) {
          throw new Error('Erro ao buscar as atividades');
        }
        const data = await response.json();
        setAtividades(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAtividades();
    criarAtividade();
  }, []);

  return (
    <>
      <div style={{ height: '100vh' }} className="d-flex justify-content-center align-items-center bg-dark">
        <div className="container" style={{width: '60%'}}>
            <table className="table table-light table-striped">
              <thead className="table-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col" style={{width: '60%'}}>Atividade</th>
                  <th scope="col" style={{width: '25%'}}>Data</th>
                  <th scope="col" style={{width: '15%'}}>Operações</th>
                </tr>
              </thead>
              <tbody id="atividades">
                {atividades.map((atividade) => (
                  <tr key={atividade.id}>
                    <th scope='row'>{atividade.id}</th>
                    <td id='content${atividade.index}'>{atividade.titulo}</td>
                    <td>{atividade.data_criacao}</td>
                    <td className='text-center'>            
                      <button data-toggle="modal" data-target="#myModalEditar" className="btn edit">
                        <i className="fa-solid fa-file-pen" style={{color: 'blue'}}></i>
                      </button>
                      <button data-toggle="modal" data-target="#myModalDeletar" className="btn delete">
                        <i className="fa fa-trash" ></i>
                      </button>
                      <button className="btn done" id="done${atividade.index}">
                        <i className="fa-solid fa-check" style={{color: 'green'}}></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot style={{borderTop: '2px solid black'}}>
                <tr>
                  <td className="text-center" scope="row" colSpan={4}>
                    <button data-toggle="modal" data-target="#myModalCriar" className="btn add" id="add"><i className="fa-solid fa-plus"></i></button>
                  </td>
                </tr>
              </tfoot>
            </table>
        </div>
      </div>
        
      <div id="myModalCriar" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Nova Atividade</h4>
            </div>
            <div className="modal-body">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="inputGroup-sizing-default">Atividade</span>
                </div>
                <input type="text" id="txtCriarAtividade" className="form-control" aria-label="Atividade" aria-describedby="inputGroup-sizing-default" />
              </div>
            </div>
            <div className="modal-footer">
              <button id="criar" type="button" className="btn btn-primary btn-criar" data-dismiss="modal">Criar</button>
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
            <div className="modal-body">
              <input type="hidden" id="rowEdit" />
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="inputGroup-sizing-default">Atividade</span>
                </div>
                <input type="text" id="txtModificarAtividade" className="form-control" aria-label="Atividade" aria-describedby="inputGroup-sizing-default" />
              </div>
            </div>
            <div className="modal-footer">
              <button id="atualizar" type="button" className="btn btn-primary btn-editar" data-dismiss="modal">Atualizar</button>
            </div>
          </div>
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
              <button type="button" className="btn btn-primary btn-deletar-nao" data-dismiss="modal">Não</button>
              <button id="confirmDelete" type="button" className="btn btn-primary btn-deletar-sim" data-dismiss="modal">Sim</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
