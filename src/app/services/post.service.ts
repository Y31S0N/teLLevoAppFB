import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  api = 'http://localhost:1337/api/';
  constructor(private http: HttpClient) { }
  getPosts(collec: string){
    return this.http.get(this.api + collec).pipe(
      map((res: any)=>{;
        return res.data;
      })
    );
  }
  getPost(collec: string, id: string){
    return this.http.get(this.api+collec+'/'+id).pipe(
      map((res: any)=>{;
        return res.data;
      })
    );
  }
  createPost(body: any, collec: string){
    return this.http.post(this.api + collec, body);
  }
  deletePost(collec: string, id: string){
    return this.http.delete(this.api + collec +'/'+id);
  }
  // //acá también me pide un url y un body
  updatePost(collec: string, id, body){
    return this.http.put(this.api + collec +'/'+id, body);
  }
}
