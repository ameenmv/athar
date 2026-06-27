class UserService {
  private prefix = "User:";

  // استخدام Arrow Function بيحفظ الـ this context بتاع الكلاس
  printUser = (name: string) => {
    console.log(this.prefix, name);
  }

  fetchUsers() {
    const users = ["Ahmed", "Ali", "Omar"];
    
    // المشكلة هنا: باصينا الـ Method كـ Callback مباشر
    users.forEach(this.printUser);
  }
}

const service = new UserService();
service.fetchUsers();
