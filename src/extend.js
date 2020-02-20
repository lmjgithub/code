function Parent(name) {
  this.name = name;
}

Parent.prototype.sayName = function() {
  console.log(this.name);
};

function Child(name) {
  Parent.call(this);
  this.name = name;
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
