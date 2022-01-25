interface RecursiveTypeCheckOverload {
   (obj: Record<string, any>, againstObj: Record<string, any>): 
      { checks: true } | { checks: false, err: string }
}

export const RecursiveTypeCheck: RecursiveTypeCheckOverload = (obj, againstObj) => {
   for(const key in againstObj) {
      //* In case type should be an array 
      if(key.startsWith('[]') || key.startsWith('_[]')) {
         //* In case is optional: checking if is even defined
         if(key.startsWith('_')) {
            const keyNoArr = key.replace('_[]', '')
            if(!obj[keyNoArr]) continue
         }
         const keyNoArr = key.replace('[]', '')

         //* In case is not defined and obligatory
         if(!obj[keyNoArr]) return {
            checks: false,
            err: `The key '${keyNoArr}' is missing!`
         }
         
         //* In case is not array check type
         if(!Array.isArray(obj[keyNoArr])) return {
            checks: false,
            err: `The key '${keyNoArr}' is not an array!`
         }
         
         //* In case is array get deeper
         Array.from(obj[keyNoArr]).forEach((value: any) => 
         RecursiveTypeCheck(value, againstObj[key]))
      }
      //* Checking if key is optional
      else if(key.startsWith('_')) {
         const keyNoUnder = key.replace('_', '')
         //* Checking if value is even defined
         if(!obj[keyNoUnder]) continue
         
         //* In case is not object check type
         if(typeof obj[keyNoUnder] !== typeof againstObj[key]) return {
            checks: false,
            err: `The key '${keyNoUnder}' is not of type '${typeof againstObj[key]}'!`
         }

         //* In case is object get deeper
         if(typeof obj[keyNoUnder] === 'object') 
            RecursiveTypeCheck(obj[keyNoUnder], againstObj[key])
      } 
      //* In case key is not optional and doesn't exist
      else if(!obj[key]) return {
         checks: false,
         err: `The key '${key}' is missing!`
      }
      //* Checking if key is of the right type
      else if(typeof obj[key] !== typeof againstObj[key]) {
         return {
            checks: false,
            err: `The key '${key}' is not of type '${typeof againstObj[key]}'`
         }
      }
      //* Get deeper in case it's an object
      else if(typeof obj[key] === 'object') {
         RecursiveTypeCheck(obj[key], againstObj[key])
      }
      
   }
   return { checks: true }
}