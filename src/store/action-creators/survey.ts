import { IAnswer, SurveyAction, SurveyActionTypes } from './../../types/survey';
import { Dispatch } from "redux";
// import axios from "axios";
// import { TodoAction, TodoActionTypes } from "../../types/todo";

// export const fetchTodos = (page = 1, limit = 10) => {
//     return async (dispatch: Dispatch<TodoAction>) => {
//         try {
//             dispatch({ type: TodoActionTypes.FETCH_TODOS })
//             const response = await axios.get('https://jsonplaceholder.typicode.com/todos', {
//                 params: { _page: page, _limit: limit }
//             })
//             setTimeout(() => {
//                 dispatch({ type: TodoActionTypes.FETCH_TODOS_SUCCESS, payload: response.data })
//             }, 500)
//         } catch (e) {
//             dispatch({
//                 type: TodoActionTypes.FETCH_TODOS_ERROR,
//                 payload: 'Произошла ошибка при загрузке списка дел'
//             })
//         }
//     }
// }
// export function setTodoPage(page: number): TodoAction {
//     return { type: TodoActionTypes.SET_TODO_PAGE, payload: page }
// }

export const updateAnswers = (answers: IAnswer[]) => {

    return async (dispatch: Dispatch<SurveyAction>) => {
        console.log('Вызвали функцию для обновления ответов');

        dispatch({
            type: SurveyActionTypes.UPDATE_ANSWERS, payload: answers
        })
    }
}