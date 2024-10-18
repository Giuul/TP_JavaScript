
// Clase Estudiante
class Estudiante {
    constructor(nombre, edad, nota) {
      this.nombre = nombre;
      this.edad = edad;
      this.nota = nota;
    }
  
    presentarse() {
      return `${this.nombre} (${this.edad} años) - Nota: ${this.nota}`;
    }
  }
  
  // Clase Curso
  class Curso {
    constructor(nombre, profesor) {
      this.nombre = nombre;
      this.profesor = profesor;
      this.estudiantes = [];
    }
  
    agregarEstudiante(estudiante) {
      this.estudiantes.push(estudiante);
    }
  
    editarEstudiante(index, nombre, edad, nota) {
      this.estudiantes[index].nombre = nombre;
      this.estudiantes[index].edad = edad;
      this.estudiantes[index].nota = nota;
    }
  
    eliminarEstudiante(index) {
      this.estudiantes.splice(index, 1);
    }
  
    listarEstudiantes() {
      return this.estudiantes.map(est => est.presentarse()).join('<br>');
    }
  
    obtenerPromedio() {
      let totalNotas = this.estudiantes.reduce((total, est) => total + est.nota, 0);
      return (this.estudiantes.length > 0) ? (totalNotas / this.estudiantes.length).toFixed(2) : 'N/A';
    }
  }
  
  // Arreglo para almacenar los cursos
  let cursos = [];
  
  // DOM elements
  const formCurso = document.getElementById('form-curso');
  const formEstudiante = document.getElementById('form-estudiante');
  const cursoEstudianteSelect = document.getElementById('curso-estudiante');
  const listaCursos = document.getElementById('lista-cursos');
  const mensajeError = document.getElementById('mensajeError');
  
  let errores = [];
  

  // Evento para agregar un curso
  formCurso.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Capturar datos del formulario
    const nombreCurso = document.getElementById('nombre-curso').value;
    const profesorCurso = document.getElementById('profesor-curso').value;
    
    // Crear un nuevo curso
    const nuevoCurso = new Curso(nombreCurso, profesorCurso);
    cursos.push(nuevoCurso);
    
    // Limpiar formulario
    formCurso.reset();
    
    // Actualizar la lista de cursos en el select
    actualizarCursosSelect();
    
    // Mostrar los cursos
    mostrarCursos();
  });
  
  // Función para validar los datos de un estudiante
  function validarFormulario(edad, nota) {
    let errores = [];
    // Validar edad
    if (isNaN(edad) || edad <= 0) {
        errores.push("La edad debe ser un número positivo.");
    }
    // Validar nota
    if (isNaN(nota) || nota < 0 || nota > 10) {
        errores.push("La nota debe ser un número entre 0 y 10.");
    }

    return errores;
    }
  
  
  // Evento para agregar un estudiante
  formEstudiante.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Capturar datos del formulario
    const nombreEstudiante = document.getElementById('nombre-estudiante').value;
    const edadEstudiante = parseInt(document.getElementById('edad-estudiante').value);
    const notaEstudiante = parseFloat(document.getElementById('nota-estudiante').value);
    const cursoIndex = cursoEstudianteSelect.value;

    // Crear un nuevo estudiante
    const nuevoEstudiante = new Estudiante(nombreEstudiante, edadEstudiante, notaEstudiante);
    // Agregar estudiante al curso seleccionado
    
    

    const errores = validarFormulario(edadEstudiante,notaEstudiante);
    if (errores.length > 0) {
        mensajeError.innerHTML = errores.join("<br>");
    } else {
        // Si no hay errores, mostramos los datos del estudiante
        mensajeError.innerHTML = "";
        cursos[cursoIndex].agregarEstudiante(nuevoEstudiante); // Limpiar los mensajes de error
    }
    
    
    
    // Agregar estudiante al curso seleccionado
    //cursos[cursoIndex].agregarEstudiante(nuevoEstudiante);
    
    // Limpiar formulario
    formEstudiante.reset();
    
    // Mostrar los cursos actualizados
    mostrarCursos();
  });
  
  // Función para actualizar el select de cursos
  function actualizarCursosSelect() {
    cursoEstudianteSelect.innerHTML = '';
    cursos.forEach((curso, index) => {
      let option = document.createElement('option');
      option.value = index;
      option.textContent = curso.nombre;
      cursoEstudianteSelect.appendChild(option);
    });
  }
  
  // Función para mostrar los cursos y estudiantes
  function mostrarCursos() {
    listaCursos.innerHTML = '';
    cursos.forEach((curso, cursoIndex) => {
      let cursoDiv = document.createElement('div');
      cursoDiv.classList.add('curso');
      
      cursoDiv.innerHTML = `
        <h3>Curso: ${curso.nombre} (Profesor: ${curso.profesor})</h3>
        <p><strong>Promedio:</strong> ${curso.obtenerPromedio()}</p>
        <button onclick="editarCurso(${cursoIndex})">Editar Curso</button>
        <button onclick="eliminarCurso(${cursoIndex})">Eliminar Curso</button>
        <div class="estudiantes">
          <strong>El curso esta conformado por:</strong><br>
          ${curso.listarEstudiantes() || 'No hay estudiantes en este curso.'}
          <br><br><br>
        </div>
      `;
      
      curso.estudiantes.forEach((estudiante, estudianteIndex) => {
        cursoDiv.innerHTML += `
          <div>
          <strong><u>Edición estudiantes:</u></strong><br>
            ${estudiante.presentarse()}
            <button onclick="editarEstudiante(${cursoIndex}, ${estudianteIndex})">Editar estudiante</button>
            <button onclick="eliminarEstudiante(${cursoIndex}, ${estudianteIndex})">Eliminar estudiante</button>
          </div>
        `;
      });
  
      listaCursos.appendChild(cursoDiv);
    });
  }
  
  // Función para editar un curso
  function editarCurso(index) {
    const nombreCurso = prompt("Nuevo nombre del curso:", cursos[index].nombre);
    const profesorCurso = prompt("Nuevo nombre del profesor:", cursos[index].profesor);
    if (nombreCurso && profesorCurso) {
      cursos[index].nombre = nombreCurso;
      cursos[index].profesor = profesorCurso;
      mostrarCursos();
      actualizarCursosSelect();
    }
  }
  
  // Función para eliminar un curso
  function eliminarCurso(index) {
    if (confirm("¿Estás seguro de que deseas eliminar este curso?")) {
      cursos.splice(index, 1);
      mostrarCursos();
      actualizarCursosSelect();
    }
  }
  
  // Función para editar un estudiante
  function editarEstudiante(cursoIndex, estudianteIndex) {
    const nombreEstudiante = prompt("Nuevo nombre del estudiante:", cursos[cursoIndex].estudiantes[estudianteIndex].nombre);
    const edadEstudiante = prompt("Nueva edad del estudiante:", cursos[cursoIndex].estudiantes[estudianteIndex].edad);
    const notaEstudiante = prompt("Nueva nota del estudiante:", cursos[cursoIndex].estudiantes[estudianteIndex].nota);
    if (nombreEstudiante && edadEstudiante && notaEstudiante) {
      cursos[cursoIndex].editarEstudiante(estudianteIndex, nombreEstudiante, parseInt(edadEstudiante), parseFloat(notaEstudiante));
      mostrarCursos();
    }
  }
  
  // Función para eliminar un estudiante
  function eliminarEstudiante(cursoIndex, estudianteIndex) {
    if (confirm("¿Estás seguro de que deseas eliminar este estudiante?")) {
      cursos[cursoIndex].eliminarEstudiante(estudianteIndex);
      mostrarCursos();
    }
  }