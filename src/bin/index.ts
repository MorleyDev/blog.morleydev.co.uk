import 'core-js';

import * as Koa from 'koa';
import * as logger from 'koa-logger';
import * as route from 'koa-route';
import { join } from 'path';

import { render } from './render';

const app = new Koa();
app
    .use(logger())
    .use(route.get(/.*/)(async context => {
        try {
            console.log(context.path);
            context.status = 200;
            context.body = await render(join(__dirname, "../www/", context.path)).catch(err => render(join(__dirname, "../www/index.html")))
        } catch {
            context.status = 404;
        }
    }));
app.listen(3000);
