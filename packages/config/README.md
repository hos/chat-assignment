# config

This package contains all the project specific configurations, like database
connection strings, API keys, etc. If there is some package specific configuration
like logger configurations, they can be (but not mandatory) placed in the package itself.

To use this package from other packages, run the following command:

```bash
yarn workspace @chat/package add @chat/config
```

and then you can import the configuration like this:

```typescript
import { PORT, SOME_OTHER_CONFIG } from '@chat/config';
```
