// Al cargar la página, restaurar datos desde LocalStorage
document.addEventListener('DOMContentLoaded', () => {
  cargarDatosLocalStorage();
  mostrarCursos();
});

// Función para guardar cursos en LocalStorage
function guardarEnLocalStorage() {
  localStorage.setItem('cursos', JSON.stringify(cursos));
}

// Función para cargar los datos desde LocalStorage
function cargarDatosLocalStorage() {
  const datosGuardados = localStorage.getItem('cursos');
  if (datosGuardados) {
      const cursosRestaurados = JSON.parse(datosGuardados);
      cursosRestaurados.forEach(cursoData => {
          const cursoRestaurado = new Curso(cursoData.nombre, cursoData.profesor);
          cursoData.estudiantes.forEach(estudianteData => {
              const estudianteRestaurado = new Estudiante(estudianteData.nombre, estudianteData.edad, estudianteData.nota);
              cursoRestaurado.agregarEstudiante(estudianteRestaurado);
          });
          cursos.push(cursoRestaurado);
      });
  }
}

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
  const buscarEstudiante = document.getElementById('buscarEstudiante');
  const buscarProfesor = document.getElementById('buscarProfesor');
  const ordenarPor = document.getElementById('ordenarPor');
  
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

    // Guardar en LocalStorage
    guardarEnLocalStorage();
    
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
        // Si no hay errores, agregamos estudiante
        mensajeError.innerHTML = "";
        cursos[cursoIndex].agregarEstudiante(nuevoEstudiante); 

        // Guardar en LocalStorage
        guardarEnLocalStorage();
    }
    
    
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
      guardarEnLocalStorage();
    });
  }
  
  // Función para mostrar los cursos y estudiantes
  function mostrarCursos() {
    listaCursos.innerHTML = '';
    cursos.forEach((curso, cursoIndex) => {
      let cursoDiv = document.createElement('div');
      cursoDiv.classList.add('curso');
      
      cursoDiv.innerHTML = `
        <h3>Curso: ${curso.nombre} - Profesor: ${curso.profesor}</h3>
        <div class="estudiantes">
          <strong>Alumnos que lo conforman:</strong><br><br>
          ${curso.listarEstudiantes() || 'No hay estudiantes en este curso.'}
          <br><br><br>
          <p><strong>Promedio:</strong> ${curso.obtenerPromedio()}</p>
          <br><br><br>
          
        </div>
        <h3><u>Edición de curso:</u></h3>
        <button onclick="editarCurso(${cursoIndex})">Editar Curso</button>
        <button onclick="eliminarCurso(${cursoIndex})">Eliminar Curso</button>
      `;
      
      curso.estudiantes.forEach((estudiante, estudianteIndex) => {
        cursoDiv.innerHTML += `
          <div>
          <br><br>
          <h3><u>Edición estudiantes:</u></h3>
            ${estudiante.presentarse()}
            <br><br>
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
    mostrarEstadisticas();
    guardarEnLocalStorage();
  }
  
  // Función para eliminar un curso
  function eliminarCurso(index) {
    if (confirm("¿Estás seguro de que deseas eliminar este curso?")) {
      cursos.splice(index, 1);
      mostrarCursos();
      actualizarCursosSelect();
    }
      mostrarEstadisticas();
    guardarEnLocalStorage();
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
    mostrarEstadisticas();
    guardarEnLocalStorage();
  }
  
  // Función para eliminar un estudiante
  function eliminarEstudiante(cursoIndex, estudianteIndex) {
    if (confirm("¿Estás seguro de que deseas eliminar este estudiante?")) {
      cursos[cursoIndex].eliminarEstudiante(estudianteIndex);
      mostrarCursos();
    }
    
    mostrarEstadisticas();
   
    guardarEnLocalStorage();
  }

  // Evento para la búsqueda de estudiantes y profesores
document.getElementById('btnBuscar').addEventListener('click', () => {
  const nombreBuscado = document.getElementById('buscarEstudiante').value.toLowerCase();
  const profesorBuscado = document.getElementById('buscarProfesor').value.toLowerCase();

  let resultados = cursos.filter(curso => {
      // Si ambos campos están vacíos, no mostrar nada
      if (!nombreBuscado && !profesorBuscado) return false;

      // Filtrar por estudiante si se ha ingresado un nombre de estudiante
      let coincidenciasEstudiante = nombreBuscado 
          ? curso.estudiantes.some(est => est.nombre.toLowerCase().includes(nombreBuscado)) 
          : true;

      // Filtrar por profesor si se ha ingresado un nombre de profesor
      let coincidenciasProfesor = profesorBuscado 
          ? curso.profesor.toLowerCase().includes(profesorBuscado) 
          : true;

      // Devolver verdadero si coincide con cualquiera de los filtros
      return coincidenciasEstudiante && coincidenciasProfesor;
  });

  // Mostrar los cursos filtrados
  listaCursos.innerHTML = '';
  resultados.forEach((curso, cursoIndex) => {
      let cursoDiv = document.createElement('div');
      cursoDiv.classList.add('curso');

      cursoDiv.innerHTML = `
          <h3>Curso: ${curso.nombre} (Profesor: ${curso.profesor})</h3>
          <p><strong>Promedio:</strong> ${curso.obtenerPromedio()}</p>
          <button onclick="editarCurso(${cursoIndex})">Editar Curso</button>
          <button onclick="eliminarCurso(${cursoIndex})">Eliminar Curso</button>
          <div class="estudiantes">
              <strong>Estudiantes:</strong><br>
      `;

      // Si se busca un estudiante, mostrar solo el estudiante filtrado
      if (nombreBuscado) {
          let estudiantesFiltrados = curso.estudiantes.filter(est => est.nombre.toLowerCase().includes(nombreBuscado));
          estudiantesFiltrados.forEach(est => {
              cursoDiv.innerHTML += `
                  ${est.presentarse()}<br>
              `;
          });
      } else {
          // Si no se busca un estudiante, mostrar todos los estudiantes del curso
          cursoDiv.innerHTML += curso.listarEstudiantes() || 'No hay estudiantes en este curso.';
      }

      cursoDiv.innerHTML += '</div>';
      listaCursos.appendChild(cursoDiv);
  });
});

// Función para ordenar estudiantes
document.getElementById('btnOrdenar').addEventListener('click', () => {
  const criterio = ordenarPor.value;
  
  cursos.forEach(curso => {
      if (criterio === 'nota') {
          curso.estudiantes.sort((a, b) => b.nota - a.nota); // Ordenar por nota descendente
      } else if (criterio === 'edad') {
          curso.estudiantes.sort((a, b) => a.edad - b.edad); // Ordenar por edad ascendente
      }
  });

  mostrarCursos(); // Actualizar la lista con los estudiantes ordenados
  guardarEnLocalStorage();
});

// Mostrar los cursos al cargar la página
mostrarCursos();


// Función para calcular y mostrar las estadísticas del sistema
function mostrarEstadisticas() {
  let totalEstudiantes = 0;
  let sumaTotalNotas = 0;
  let mejorCurso = null;
  let mejorPromedio = -1;
  
  // Recorrer todos los cursos
  cursos.forEach(curso => {
      totalEstudiantes += curso.estudiantes.length; // Contar estudiantes

      // Calcular el promedio de este curso
      const promedioCurso = curso.obtenerPromedio();
      sumaTotalNotas += curso.estudiantes.reduce((acc, est) => acc + est.nota, 0); // Sumar todas las notas

      // Comparar para encontrar el curso con mejor promedio
      if (promedioCurso > mejorPromedio) {
          mejorPromedio = promedioCurso;
          mejorCurso = curso.nombre;
      }
      guardarEnLocalStorage();
  });

  // Calcular el promedio general de todos los estudiantes
  const promedioGeneral = totalEstudiantes > 0 ? (sumaTotalNotas / totalEstudiantes).toFixed(2) : 0;

  // Actualizar los datos en el DOM
  document.getElementById('total-cursos').textContent = cursos.length;
  document.getElementById('total-estudiantes').textContent = totalEstudiantes;
  document.getElementById('promedio-general').textContent = promedioGeneral;
  document.getElementById('mejor-curso').textContent = mejorCurso ? mejorCurso : 'N/A';
}

// Llamar a la función de estadísticas cada vez que se actualicen los cursos o estudiantes
formCurso.addEventListener('submit', () => {
  mostrarEstadisticas();
});

formEstudiante.addEventListener('submit', () => {
  mostrarEstadisticas();
});

// Función para actualizar las estadísticas tras editar o eliminar
function actualizarEstadisticas() {
  mostrarEstadisticas();
  guardarEnLocalStorage();
}

// Al cargar la página, mostrar las estadísticas iniciales
document.addEventListener('DOMContentLoaded', () => {
  mostrarEstadisticas();
});

// Función para descargar el archivo JSON
function exportarJSON() {
  const dataStr = JSON.stringify(cursos, null, 2);  
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gestionDeCursos.json';
  link.click();
  URL.revokeObjectURL(url);  
}

// Evento al hacer clic en el botón de exportar JSON
document.getElementById('btnExportarJSON').addEventListener('click', exportarJSON);

