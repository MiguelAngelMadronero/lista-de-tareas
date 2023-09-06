
import todoStore, { Filters } from '../store/todo.store';
import html from './app.html?raw';
import { renderTodos, renderPending } from './use-cases';

const ElementIDs={
    TodoList: '.todo-list',
    NewTodoInput:'#new-todo-input',
    ClearCompleted:'.clear-completed',
    TodoFilters:'.filtro',
    PendingCountLabel:'#pending-count',
   

}
/**
 * 
 * @param {String} elementId 
 */
export const App=(elementId)=>{

    const displayTodos=()=>{
        const todos= todoStore.getTodos(todoStore.getCurrentFilter());
        renderTodos(ElementIDs.TodoList, todos);
        updatePendingCount();
    }

    const updatePendingCount=()=>{
        renderPending(ElementIDs.PendingCountLabel);
    }

     //Cuando la funcion App() se llama
    (()=>{
        const app=document.createElement('div');
        app.innerHTML=html;
        document.querySelector(elementId).append(app);
        displayTodos();
    })();

    //Referencias HTML

    const newDescriptionInput= document.querySelector(ElementIDs.NewTodoInput);
    const todoListUL=document.querySelector(ElementIDs.TodoList);
    const clearClompletedButton=document.querySelector(ElementIDs.ClearCompleted);
    const filtersLIs=document.querySelectorAll(ElementIDs.TodoFilters);

    //Listeners o eventos
    newDescriptionInput.addEventListener('keyup', (event)=>{
       if(event.keyCode!==13) return; //el 13 en el keyCode significa enter, cuando le damos enter paramos la funcion
       if(event.target.value.trim().length === 0) return;

       todoStore.addTodo(event.target.value);//insertamos el texto pero no la renderiza
       displayTodos()//renderiza el texto que insertamos anteriormente
       event.target.value='';
    });
    
    todoListUL.addEventListener('click', (event)=>{
        const element=event.target.closest('[data-id]');
        todoStore.toggleTodo(element.getAttribute('data-id'));
        displayTodos();
    });
    
    todoListUL.addEventListener('click', (event)=>{
       const isDestroyElement=event.target.className === 'destroy';
       const element=event.target.closest('[data-id]');
       if(!element || !isDestroyElement) return;
       
       todoStore.deleteTodo(element.getAttribute('data-id'));
       displayTodos();
       
    });

    clearClompletedButton.addEventListener('click', ()=>{
        todoStore.deleteCompleted();
        displayTodos();
    });

    filtersLIs.forEach(element=>{//evento para un arreglo de elementos, en este caso un arreglo de etiquetas html
        element.addEventListener('click', (element)=>{
            filtersLIs.forEach(el=> el.classList.remove('selected'));
            element.target.classList.add('selected')
            
            switch(element.target.text){
                case 'Todos':
                    todoStore.setFilter(Filters.All)
                break;
                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending)
                break;
                case 'Completados':
                    todoStore.setFilter(Filters.Completed)
                break;

                
            }

            displayTodos();

        });
    })
    

    

}