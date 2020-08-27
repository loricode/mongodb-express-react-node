import React, { useState, useEffect } from 'react';
import axios from 'axios'; //npm i axios

const URL = process.env.REACT_APP_URI  //variable de entorno  

const App = () => {
 
  const [ listaLibro, setListaLibro ] = useState([])
  const [ id, setId ] = useState('')
  const [ nombre, setNombre ] = useState('')
  const [ edicion, setEdicion ] = useState('')
  const [ buscar, setBuscar ] = useState('')
  const [ texto, setTexto ] = useState('')
  const [ bandera, setBandera ] = useState(true)

  useEffect(() => {
  getLibros()
},[])

function filtro (){
  return listaLibro.filter((libro) =>
         libro.nombre.toLowerCase().indexOf(buscar.toLowerCase()) > -1)   
}

const getfiltro = async () =>{
  const res = await axios.get(URL+'/'+texto)
  setListaLibro(res.data)
}

const refresh = () =>{
  getLibros()
  setBuscar('')
}

const buscando = () => {
    setListaLibro(filtro())
}

const getLibros = async () => {
    const res = await axios.get(URL) 
    setListaLibro(res.data) 
}

const addLibro = async () => {
    let obj = { nombre, edicion } 
    const res = await axios.post(URL, obj) 
    console.log(res.data)
    setNombre('')
    setEdicion('')
}  

const deleteLibro = async (id) => {
    const res = await axios.delete(URL+'/'+id)
    console.log(res.data)
    getLibros()
}

const getLibro = async (id) => {
    const res = await axios.get(URL+'/obtener/'+id)
    setId(res.data._id)
    setNombre(res.data.nombre)
    setEdicion(res.data.edicion)
    setBandera(false)
}

const addOrUpdateLibro = () => {
    bandera? addLibro() : update()   
}

const update = async () => {
    const obj = { id, nombre, edicion }
    const res = await axios.put(URL, obj)
    console.log(res.data)
    setBandera(true)
    setNombre('')
    setEdicion('')
    getLibros()
}


  return (
    <div className="container">   

     <nav className="navbar navbar-dark bg-primary">
       <a className="navbar-brand" href="/">MONGODB EXPRESS REACTJS NODE (MERN)
      </a>
    </nav>

     <div className="row">

       <div className="col-md-4"> 
         <h1 className="text-primary">Bookstore</h1>
         
         <input
             className="form-control mb-2" placeholder="filtro array" value={buscar}
             onChange={(e) => setBuscar(e.target.value)}
             onKeyUp={buscando} 
          />
          <button 
              className="btn btn-primary" 
              onClick={refresh}>REFRESH</button>
        </div>
    
       <div className="col-md-4">
       
         <div className="card p-2 mt-3">
          
           <input
             className="form-control mb-2" placeholder="Nombre"
             value={nombre}
             onChange={(e) => setNombre(e.target.value)} 
           />

           <input 
             className="form-control mb-2"  placeholder="Edicion" 
             value={edicion}
             onChange={(e) => setEdicion(e.target.value)} 
            />

            <button 
              className="btn btn-primary" 
              onClick={addOrUpdateLibro}>{bandera?'add':'update'}</button>  
       </div>   
    </div>
       
       <div className="col-md-4">
         <h3 > Cantidad de libros: { listaLibro.length } </h3>
         
         <input
             className="form-control mb-2" placeholder="filtro db" value={texto}
             onChange={(e) => setTexto(e.target.value)}
             onKeyUp={getfiltro} 
          />
        </div>
     </div>
     
     <div className="row mt-4 ">   
         { listaLibro.map(item => (
          <div key={item._id}  className="col-md-4">
            <div className="card p-3 m-2 border-primary">
               <p>Nombre: {item.nombre}</p>
               <p>Edicion: {item.edicion}</p>  
               <div className="d-flex flex-row-reverse">
               <button 
                 className="btn btn-danger" 
                 onClick={() => deleteLibro(item._id)}>DELETE</button> 
               <button 
                 className="btn btn-success mr-2" 
                 onClick={() => getLibro(item._id)}>UPDATE</button> 
                 </div>  
            </div>
          
          </div>

        ))} 
        </div> 
    </div>
  );
}

export default App;
