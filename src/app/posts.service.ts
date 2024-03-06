import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Post } from './post.model';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService implements OnInit {
  error: Subject<string> = new Subject();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  crateAndStorePosts(title: string, content: string): void {
    const postData: Post = { title, content };
    this.http
      .post<{ name: string }>(
        'https://http-acg-default-rtdb.firebaseio.com/posts.json',
        postData,
        {
          observe: 'response',
          responseType: 'json',
        }
      )
      .subscribe({
        next: (responseData) => {
          console.log(responseData.body);
        },
        error: (error: HttpErrorResponse) => {
          this.error.next(
            `${error.error['error']}, ${error.status} ${error.statusText.toUpperCase()}`
          );
        },
      });
  }

  fetchPosts(): Observable<Post[]> {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');
    return this.http
      .get<{ [key: string]: Post }>(
        'https://http-acg-default-rtdb.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
          params: searchParams,
          responseType: 'json'
        }
      )
      .pipe(
        map((responseData) => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  updatePosts() {}

  removePosts(): Observable<Object> {
    return this.http
      .delete(`https://http-acg-default-rtdb.firebaseio.com/posts.json`, {
        observe: 'response',
        responseType: 'json',
      })
      .pipe(
        tap((event) => {
          console.log(event);
        })
      );
  }
}
