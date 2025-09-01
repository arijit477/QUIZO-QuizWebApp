import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoginService } from "./login.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private login:LoginService){}

    intercept(
        req: HttpRequest<any>, 
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        // Optionally skip adding token for specific public endpoints
        if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
            return next.handle(req);
        }

        // Add the jwt token (which is stored in localstorage) to the request
        const token = this.login.getToken();

        let Authreq = req;

        // Ensure the token is added for all requests except login/register
        if (token != null) {
            // Clone the request and set the new header in a way that works for absolute URLs
            Authreq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('AuthInterceptor added Authorization header');
            return next.handle(Authreq);
        }

        return next.handle(req);
    }

}

export const authInterceptorProviders = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi:true,
    }
];
