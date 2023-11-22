import { ACTIONS } from "./App";

const OperationButton = ({ operation, dispatch }) => {
  return (
    <button onClick={() => { dispatch({ 
      type: ACTIONS.DO_OPERATION, 
      payload: {operation}
    })}}>{ operation }</button>
  )
}

export default OperationButton;