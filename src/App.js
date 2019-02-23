import React, { Component } from 'react';
import TodoListTemplate from './components/TodoListTemplate';
import Form from './components/Form';
import TodoItemList from './components/TodoItemList';

class App extends Component {

  // 생성자에서 todos 항목
  constructor(props){
    super(props);


    console.log("localStorage.length = " + localStorage.length);
    if(localStorage.length!==0)
    {
      for(var ii=0; ii<localStorage.length;ii++)
      {
        var str=localStorage.getItem(ii);

        if(str !== null)
        {
          var strSplit = str.split('$');
          var bCheck=null
          if (strSplit[1]==="0"){
            bCheck=false;
          }
          else {
            bCheck=true;
          }

          //var arrTodos=new arrTodos(ii,strSplit[0],strSplit[1]);
          //this.state.todos.concat(arrTodos);

          console.log("ii= " + ii +"\n" + "strSplit[0]= " + strSplit[0] +"\n" +bCheck);
          this.state.todos.push(
            {
              id: ii,
              text: strSplit[0],
              checked:bCheck
            }
          );
        }
      }
    }
    //localStorage.clear();
    console.log("localStorage.length = " + localStorage.length);

  }

  //id = 3 // 이미 0,1,2 가 존재하므로 3으로 설정

  state = {
    input: '',
    todos: [

      //{ id: 0, text: ' 리액트 소개', checked: false },
      //{ id: 1, text: ' No not Key in by hangul', checked: true },
      //{ id: 2, text: ' Weight Training', checked: false }
    ]
  }

  handleChange=(e)=>{
  	this.setState({
  		input: e.target.value
  	});
  }
// 눌려진 키가 Enter 면 handleCreate 호출
  handleCreate=()=>{

  	const{input, todos}=this.state;
  	this.setState({
  	  input: '', // 인풋 비우고
      // concat 을 사용하여 배열에 추가
      todos: todos.concat({
      	id: this.id++,
      	text: input,
      	checked:false
      })
  	});

    console.log(this.id);
    var TmpValue=this.state.input+"$"+0;
    console.log(TmpValue);
    localStorage.setItem(this.id, TmpValue);

    console.log(this.id + " : " +localStorage.getItem(this.id));
    //localStorage.clear();

  }

  handelKeyPress=(e)=>{
  	// 눌려진 키가 Enter 면 handleCreate 호출
  	if(e.key==='Enter'){
  		this.handleCreate();
  	}

  }

  handleToggle = (id) => {
    const { todos } = this.state;

    // 파라미터로 받은 id 를 가지고 몇번째 아이템인지 찾습니다.
    const index = todos.findIndex(todo => todo.id === id);
    const selected = todos[index]; // 선택한 객체

    const nextTodos = [...todos]; // 배열을 복사

    // 기존의 값들을 복사하고, checked 값을 덮어쓰기
    nextTodos[index] = {
      ...selected,
      checked: !selected.checked
    };

    this.setState({
      todos: nextTodos
    });
  }

  handleRemove=(id)=>{
  	const {todos}=this.state;
  	this.setState({
  		todos: todos.filter(todo=>todo.id!==id)
  	});
  }


  render() {




    const{input}=this.state;
  	const{
  		handleChange,
  		handleCreate,
  		handelKeyPress,
  		handleToggle,
  		handleRemove
  	}=this;



    return (
      <TodoListTemplate form={(
      	<Form
      		value={input}
      		onKeyPress={handelKeyPress}
      		onChange={handleChange}
      		onCreate={handleCreate}
      	/>
      )}>
        <TodoItemList todos={this.state.todos} onToggle={handleToggle} onRemove={handleRemove}/>
      </TodoListTemplate>

    );


  }



}

export default App;
