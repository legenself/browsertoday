import path from 'path';
import sq3 from 'sqlite3';
// import { docDir } from './settings';
// 将数据存至系统用户目录，防止用户误删程序
export const dbPath = path.join('C:\\Users\\legen\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\','History');

const sqlite3 = sq3.verbose();
const db = new sqlite3.Database(dbPath);
// db.serialize(() => {

//  db.run("create table test(name varchar(15))",function(){
//   db.run("insert into test values('hello,word')",function(){
//     db.all("select * from test",function(err,res){
//       if(!err){
//         console.log(JSON.stringify(res));
//       }
//       else{
//         console.log(err);
//       }
//     });
//   });
// });


// });

export default db;