import { useEffect, useState } from "react"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type Atividade = {
  id: number
  titulo: string
  id_usuario: number
  data_criacao: string
  data_resolucao: string
}

const baseURL = 'http://localhost:5000'

function Gestor() {
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [txtNomeAtividade, setTxtNomeAtividade] = useState<string>('')

  const criarAtividade = async () => {
    try {
      const novaAtividade = {
        titulo: "Nova atividade",
        id_usuario: 1
      };

      const cookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
      if (!cookie) {
        throw new Error('Token não encontrado no cookie');
      }
      const token = cookie.split('=')[1];

      const response = await fetch(baseURL + '/atividades.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(novaAtividade)
      });

      if (!response.ok) {
        throw new Error('Erro ao criar atividade');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
    }
  };

  useEffect(() => {
    const fetchAtividades = async () => {
      try {
        const cookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
        if (!cookie) {
          throw new Error('Token não encontrado no cookie');
        }
        const token = cookie.split('=')[1];

        const response = await fetch(baseURL + '/atividades.php', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

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
  }, []);

  return (
    <>
      <div style={{ height: '100vh' }} className="flex flex-col dark:bg-slate-800">
        <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <svg className="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/></svg>
            <span className="font-semibold text-xl tracking-tight">Tailwind CSS</span>
          </div>
          <div className="block lg:hidden">
            <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
              <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
            </button>
          </div>
          <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <div className="text-sm lg:flex-grow">
              <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                Docs
              </a>
              <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                Examples
              </a>
              <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
                Blog
              </a>
            </div>
            <div>
              <a href="#" className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Download</a>
            </div>
          </div>
        </nav>
        <div className="flex justify-center item-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Show Dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
            <div className="modal-body d-flex justify-content-center">
              <form style={{ width: '26rem' }}>
                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor="form4Example1">Título</label>
                  <input type="text" id="form4Example1" className="form-control" />
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor="form4Example2">Email address</label>
                  <input type="email" id="form4Example2" className="form-control" />
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor="form4Example3">Descrição</label>
                  <textarea className="form-control" id="form4Example3" rows={4}></textarea>
                </div>
              </form>
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

export default Gestor
