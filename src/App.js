import React, { Component } from 'react';
import TodoListTemplate from './components/TodoListTemplate';
import Form from './components/Form';
import TodoItemList from './components/TodoItemList';

class App extends Component {

  // 생성자에서 todos 항목
  constructor(props){
    super(props);    
    this.RefreshTodos();
  }

  RefreshTodos=()=>{
    if(localStorage.length!==0)
    {
      for(var ii=0; ii<localStorage.length;ii++)
      {
        var str=localStorage.getItem(ii);

        console.log(ii + " : str = " + str);
        if(str !== null)
        {
          var strSplit = str.split('$');
          var bCheck=null
          if (strSplit[2]==="0"){
            bCheck=false;
          }
          else {
            bCheck=true;
          }
          this.state.todos.push({
              id: strSplit[0],
              text: strSplit[1],
              checked:bCheck
          });
        }
      }
    }
    //localStorage.clear();
  }

  id = 0 // 이미 0,1,2 가 존재하므로 3으로 설정

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

    // get id (localStorage가 0개 이상일때 마지막 저장된 id보다 1 큰 숫자)
    if (localStorage.length===0)
    {
      this.id=0;  
    }
    else
    {
      // key(id)를 0부터 localStorage.length까지 검사하고 중간에 빈 숫자가 있으면 그 숫자를 id로 저장한다.
      // localStorage.length가 끝날때까지 빈 숫자가 없으면 "localStorage.length"를 id로 저장한다.
      var bExistEmpty=false;
      for (var idx=0; idx<localStorage.length;idx++)
      {
        if(localStorage.hasOwnProperty(idx)===false)
        {
          this.id=idx;
          bExistEmpty=true;
          break;
        }
      }

      if (bExistEmpty===false)
      {
        this.id= localStorage.length;  
      }
      
    }
    // localStorage에 저장할 "value" 만들고 localStorage에 저장함
    var TmpValue=this.id+"$"+this.state.input+"$"+0;
    localStorage.setItem(this.id, TmpValue);
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


    // Toggle 된 아이템의 값을 localstorage에도 업데이트 한다
    var TmpArray=[];

    for(var ii=0; ii<localStorage.length;ii++)
    {
      var Tmpstr=localStorage.getItem(ii);
      var strSplit = Tmpstr.split('$');

      if (id===strSplit[0])
      {
        if (strSplit[2]==='1')
        {
          strSplit[2]=0;
        }
        else if (strSplit[2]==='0')
        {
          strSplit[2]=1;
        }

        Tmpstr=strSplit[0]+"$"+strSplit[1]+"$"+strSplit[2];
        console.log("id = " + id+ " // ChagedStr = " + Tmpstr);
      }
      
      // LocalStorage에 저장하기 위해 TmpArray에 저장함. 
      TmpArray[ii]=Tmpstr;
      
    }

    // 2. localstorage를 clear 했다가 다시 정의함.
    this.UpdateLocalStorage(TmpArray);
  }

  handleRemove=(id)=>{
    console.log("selected id = " + id);

    const { todos } = this.state;
    this.setState({
      todos: todos.filter(todo => todo.id !== id)
    });

    // 1. localstorage에서 id값을 가진 data를 뺀 dataSet을 별도 array에 저장하고
    if(localStorage.length!==0)
    {
      var TmpArr=[];
      var TmpArrIdx=0;

      for(var ii=0; ii<localStorage.length;ii++)
      {
        var Tmpstr=localStorage.getItem(ii);
        var strSplit = Tmpstr.split('$');


        if (id!==strSplit[0])
        {
          TmpArr[TmpArrIdx]=localStorage.getItem(ii);
          TmpArrIdx=TmpArrIdx+1;
        }
      }

    }

    // 2. localstorage를 clear 했다가 다시 정의함.
    this.UpdateLocalStorage(TmpArr);
    this.RefreshTodos();
    //window.location.reload();
    
  }

  UpdateLocalStorage=(TmpArr)=>{
    localStorage.clear();

    for(var idx=0; idx<TmpArr.length;idx++)
    {
      var str=TmpArr[idx];
      localStorage.setItem(idx,str);
    }

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
