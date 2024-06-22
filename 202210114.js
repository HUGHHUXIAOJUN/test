class Parent{
  constructor(){
    this.name = 'zzz'
  }
  getName(){
    console.log(this.name)
  }
}
class children extends Parent{
  constructor(){
    super()
  }
}