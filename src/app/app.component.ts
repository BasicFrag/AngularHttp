import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching: boolean = false;
  error = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postsService: PostsService) {}
  

  ngOnInit() {
    this.errorSub = this.postsService.error.subscribe(
      errorMessage => this.error = errorMessage
    );
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    this.postsService.crateAndStorePosts(postData.title, postData.content);
    this.fetchPosts();
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
    this.postsService.removePosts().subscribe(
      () => {
        this.loadedPosts = []
      },
      (error: HttpErrorResponse) => {
        this.error = error.message;
        this.isFetching = false;
      }
    );
  }

  private fetchPosts() {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe((posts) => {
      this.loadedPosts = posts;
      this.isFetching = false;
    }, (error:HttpErrorResponse) => {
      this.isFetching = false;
      this.error = `${error.error['error']}, ${error.status} ${(error.statusText).toUpperCase()}`
    });
  }

  onHandleError() {
    this.error = null;
    this.isFetching = false;
  }


  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

}
