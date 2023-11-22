import { useReducer } from 'react';
import './App.css';
import DigitButton from './digitButton.component';
import OperationButton from './operationButton.component';

export const ACTIONS = {
  ADD_DIGIT: 'add_digit',
  CLEAR: 'clear',
  DO_OPERATION: 'add_operation',
  EVALUATE: 'evaluate',
  DELETE: 'delete'
}

const calcReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === "0" && state.currentOperand === "0") return state;

      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit, 
          overwrite: false
        }
      }

      if (payload.digit === "." && state.currentOperand &&
      state.currentOperand.includes(".")) 
        return state;

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }

    case ACTIONS.DO_OPERATION:
      if (state.currentOperand === null && state.prevOperand === null) return state;

      if (state.prevOperand === null) {
        return {
          prevOperand: state.currentOperand,
          currentOperand: null,
          operation: payload.operation
        } 
      }

      if (state.currentOperand === null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      return {
        prevOperand: evaluate(state),
        currentOperand: null,
        operation: payload.operation,
      }

    case ACTIONS.EVALUATE:
      if (state.prevOperand === null || state.currentOperand === null) return state;

      return {
        currentOperand: evaluate(state),
        prevOperand: null,
        operation: null,
        overwrite: true
      }

    case ACTIONS.CLEAR:
      return INITIAL_STATE;

    case ACTIONS.DELETE:
      if (state.currentOperand) 
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }
      
      if (!state.currentOperand && state.prevOperand) 
        return {
          ...state,
          currentOperand: state.prevOperand,
          prevOperand: null,
          operation: null
        }
      return
    default:
      throw new Error(`Unhandled type ${type}`)
  }

}

const evaluate = ({ prevOperand, currentOperand, operation }) => {
  const prev = parseFloat(prevOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let evaluation = 0;
  switch (operation) {
    case "+": evaluation = prev + current; break; 
    case "-": evaluation = prev - current; break; 
    case "*": evaluation = prev * current; break; 
    case "÷": evaluation = prev / current; break; 
    default: return;
  }
  return evaluation.toString();
}

const INITIAL_STATE = {
  prevOperand: null,
  currentOperand: null, 
  operation: null
} 

const App = () => {
  const [{ 
    prevOperand, 
    currentOperand, 
    operation
  }, dispatch] = useReducer(calcReducer, INITIAL_STATE);

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="prev-operand">
          {prevOperand} {operation}
        </div>
        <div className="current-operand">
          {currentOperand}
        </div>
      </div>
      <button className="span-two" onClick={
        () => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={
        () => dispatch({type: ACTIONS.DELETE})}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch}/>
      <DigitButton digit="0" dispatch={dispatch}/>
      <button 
        className="span-two"
        onClick={() => dispatch({ 
          type: ACTIONS.EVALUATE, 
          payload: null
        })}> = </button>
    </div>
  );
}

export default App;
