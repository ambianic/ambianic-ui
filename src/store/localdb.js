import Dexie from 'dexie'

/**
 * LocalDatabase API for browser indexeddb objects
 */
export class LocalDatabase extends Dexie {
  constructor() {
    // run the super constructor Dexie(databaseName) to create the IndexedDB
    // database.
    super('ambianic-database')

    // create the todos store by passing an object into the stores method. We
    // declare which object fields we want to index using a comma-separated
    // string; the ++ for the index on the id field indicates that "id" is an
    // auto-incrementing primary key, while the "done" field is just a regukar
    // IndexedDB index.
    this.version(1).stores({
      // mydevices keeps information about user's list of managed edge devices
      mydevices: '++id, peerid',
    })

    // we can retrieve our todos store with Dexie.table, and then use it as a
    // field on our Database class for convenience
    this.mydevices = this.table('mydevices')
  }

  // getTodos retrieves all todos from the todos object store in a defined
  // order; order can be:
  // - forwardOrder to get the todos in forward chronological order
  // - reverseOrder to get the todos in reverse chronological order
  // - unfinishedFirstOrder to get the todos in reverse chronological order
  async getTodos(order) {
    // In Dexie, we create queries by chaining methods, such as orderBy to
    // sort by an indexed field, and reverse to reverse the order we retrieve
    // data in. The toArray method returns a promise that resolves to the array
    // of the items in the todos store.
    let todos = [];
    switch (order) {
      case forwardOrder:
        todos = await this.todos.orderBy('id').toArray();
        break;
      case reverseOrder:
        todos = await this.todos.orderBy('id').reverse().toArray();
        break;
      case unfinishedFirstOrder:
        todos = await this.todos.orderBy('done').toArray();
        break;
      default:
        // as a default just fall back to forward order
        todos = await this.todos.orderBy('id').toArray();
    }

    // The reason we need to modify the done field on each todo is because in
    // IndexedDB, integers can be indexed, but booleans cannot, so we represent
    // "done" status as an integer. Only the database logic needs to know that
    // detail, though, so for convenience when we return the todos, their "done"
    // status is a boolean.
    return todos.map((t) => {
      t.done = !!t.done;
      return t;
    });
  }

  // setTodoDone sets whether or not the todo with the ID passed in is done.
  // Returns a promise that resolves if the update is successful.
  setTodoDone(id, done) {
    return this.todos.update(id, { done: done ? 1 : 0 })
  }

  // addTodo adds a todo with the text passed in to the todos object store.
  // Returns a promise that resolves if the addition is successful.
  addTodo(text) {
    // add a todo by passing in an object using Table.add.
    return this.todos.add({ text: text, done: 0 })
  }

  // deleteTodo deletes a todo with the ID passed in from the todos object
  // store. Returns a promise that resolves if the deletion is successful.
  deleteTodo(todoID) {
    // delete a todo by passing in the ID of that todo.
    return this.todos.delete(todoID);
  }
}
