import { HttpRequest, HttpResponse } from './Http/Http';

export interface Controller {
    handle(request: HttpRequest): HttpResponse;
}
