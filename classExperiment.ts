interface Name {
  name: string | undefined;
  age: number | null;
  job: any;
}

class Person<T> {
  protected name: T;

  constructor(name: T) {
    this.name = name;
  }

  introduceMe(): void {
    console.log(this.name);
  }
}

const bryan: Person<Name> = new Person<Name>({
  name: 'bryan',
  age: 19,
  job: {
    main: 'programmer',
    second: 'dawah',
  },
});
bryan.introduceMe();
