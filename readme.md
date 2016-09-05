# StringMath.js

A javascript library that calculate the big number(Even greater than 2^53);

## parameter and return
Allow input number or string(we can call it StringNumber, number represented by a string, RegExp: /^\+\-\w+$/), it should be noted that the maximum number of JS security is Math.pow(2, 53) - 1, function all return string(StringNumber);

##Use
### plus (+)
Allow at least one parameter;
``` javascript
StringMath.plus(-Math.pow(2, 50), '-3234324823992349023439204', 343242.34, Math.pow(4, 23));
```

### subtract (-)
Allow at least one parameter;
``` javascript
StringMath.subtract(Math.pow(2, 43), '34237489741142345487987745646784', -45415.323);
```

### multiply (*)
Allow at least one parameter;
``` javascript
StringMath.multiply(Math.pow(2, 53)-1, '789749712323434', -87977.23434454);
```

### divide (/)
Allow at least one parameter;

StringMath.DIVIDE_DECIMAL_LIMIT(default 5) to set decimal length;
StringMath._divide_remain to keep the last devide remain data;
StringMath._divide_int_result to keep the last devide int result;
``` javascript
StringMath.divide(343432432423, '123645648797456787448978797', -4545.771231);
```

### mod (%)
Allow two parameters;
``` javascript
StringMath.mod('789749712323434', -4545.32);
```

### eq (=)
Allow two parameters;
``` javascript
StringMath.eq('789749712323434', 789749712323434);
```

### gt (>)
Allow two parameters;
``` javascript
StringMath.gt(1, '12345673234');
```

### gte (>=)
Allow two parameters;
``` javascript
StringMath.gte(1, '12345673234');
```

### lt (<)
Allow two parameters;
``` javascript
StringMath.lt('2137489127897541278789', 53);
```

### lte (<=)
Allow two parameters;
``` javascript
StringMath.lt('2137489127897541278789', '2137489127897541278789');
```
### max
get the maximum number of the inputs 
Allow at least two parameters;
``` javascript
StringMath.max(1, '2137489127897541278789', Math.pow(2, 32));
```

### min
get the minimum number of the inputs 
Allow at least two parameters;
``` javascript
StringMath.min(1, '2137489127897541278789', Math.pow(2, 32));
```

### round
Allow only one parameter;
``` javascript
StringMath.round('2137489127897541278789.3243434324');
```

### ceil
Allow only one parameter;
``` javascript
StringMath.ceil('-2137489127897541278789.3243434324');
```

### floor
Allow only one parameter;
``` javascript
StringMath.floor('2137489127897541278789.3243434324');
```

### abs
Allow only one parameter;
``` javascript
StringMath.abs('-2137489127897541278789.3243434324');
```

### toFixed
Allow two parameters, first is StringNumber, second is the decimal length youd want to keep;
``` javascript
StringMath.toFixed('2137489127897541278789.324567', 4); // => '2137489127897541278789.3246'
```

### pow
Allow two parameters, first is StringNumber, second is the exponent sign(do not support decimal number);
``` javascript
StringMath.pow('2137489127897541278789.332', '3323');
```
### system
Convert the decimal StringNumber to other system, like Number.prototype.toString(radix)
Allow two parameters, first is StringNumber, second is the target system to convert (less than 32);
``` javascript
StringMath.system('2137489127897541278789', 32);
```

### bin
decimal to binary
Allow one parameter, it is the StringNumber;
``` javascript
StringMath.bin('2137489127897541278789');
```

### oct
decimal to octonary
Allow one parameter, it is the StringNumber;
``` javascript
StringMath.oct('2137489127897541278789');
```

### hex
decimal to hexadecimal
Allow one parameter, it is the StringNumber;
``` javascript
StringMath.hex('2137489127897541278789');
```

### dec
Convert the other system StringNumber to decimal system, like parseInt(Number, radix)
Allow two parameters, first is StringNumber, second is the origin system (less than 32);
``` javascript
StringMath.dec('2137489127897541278789', 32);
```
