import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService{
  constructor(private firestore: AngularFirestore){}

  createDoc(path: string, id: string, data: any){
    const col = this.firestore.collection(path);
    return col.doc(id).set(data);
  }
  readDoc(path: string, id: string){
    const col = this.firestore.collection(path);
    return col.doc(id).valueChanges();
  }
  updateDoc(path: string, id: string, data: any){
    const col = this.firestore.collection(path);
    return col.doc(id).update(data);
  }
  deleteDoc(path: string, id: string){
    const col = this.firestore.collection(path);
    return col.doc(id).delete();
  }
  readCollection(path: string){
    const col = this.firestore.collection(path);
    return col.valueChanges();
  }
}
