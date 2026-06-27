let count = 0;

function updateCounter() {
  count += 1;
  console.log("Counter is now:", count);
}

// الطريقة الصحيحة: بنباصي اسم الدالة (Reference) من غير الأقواس ()
setTimeout(updateCounter, 1000);
setTimeout(updateCounter, 1000);
setTimeout(updateCounter, 1000);

console.log("Waiting for timers...");
