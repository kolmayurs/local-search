import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

/*const App: React.FunctionComponent<{
  count?: number;
}> = (props) => {
  return <h1>{props.count}</h1>;
};*/
interface Props{

}
interface State{
  input: string;
  data: Array<any>;
  loading: boolean;
  localdata: Array<string>;
}
interface items{
  employee_name: string;
  employee_salary: string;
  employee_age: string;
}
class App extends React.Component<Props,State>{

  state: State = {
   data: [],
   loading: true,
   input:'',
   localdata:[],
  };
  componentDidMount(){
    if(!localStorage.getItem("list")){
      this.setState({localdata:[]});
    }
    else{
      let a: any = localStorage.getItem("list");
      this.setState({localdata: JSON.parse(a)});
    }
    axios.get('http://dummy.restapiexample.com/api/v1/employees')
    .then(res => {
      this.setState({data: res.data.data, loading:false});
    })
    .catch(err => {
      console.log(err);
    })
  }

  search(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({input: e.target.value});
  }
  local(employees:string){
    if(this.state.localdata.indexOf(employees) === -1){
      console.log('Old Array: '+this.state.localdata);
      let a = this.state.localdata;
      a.push(employees);
      this.setState({localdata: a});
      console.log('New Array: '+this.state.localdata);
      localStorage.setItem("list", JSON.stringify(this.state.localdata));
    }
  }
  render(){
    if(this.state.loading){
      return <div>Loading..</div>
    }
    let result:Array<any> = [];
    const data =  this.state.data.map((items: items,i:number) => {

      if(this.state.input.toLowerCase() === ''){
        return(
          <div key={'data_'+i} onClick={this.local.bind(this,items.employee_name)}>{items.employee_name+' || '+items.employee_salary+' || '+items.employee_age}</div>
          )
          
      }
     if(items.employee_name.toLowerCase().includes(this.state.input.toLowerCase())){
      result.push(items.employee_name);
        return(
          <div key={'data_'+i} onClick={this.local.bind(this,items.employee_name)}>{items.employee_name+' || '+items.employee_salary+' || '+items.employee_age}</div>
          )
      }
    })

    const search= this.state.localdata.map((items,i)=>{
      if(i !== this.state.localdata.length-1){
        return(<span  key={'search_'+i}>{items}, </span>)
      }
      else{
        return(<span  key={'search_'+i}>{items}</span>)
      }
      
    })
 
    return (
    <div>
    <input type="text" value={this.state.input} onChange={this.search.bind(this)} />
    <fieldset>
    <div>Search Items: {search}</div>
    </fieldset>
    <div>{data}</div>
    </div>);
  }
}

export default App;

