import { FieldProps, getIn } from 'formik'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getErrorMessage<V = any>({ field, form }: FieldProps<V>):any {
  const error = getIn(form.errors, field.name)
  const touched = getIn(form.touched, field.name)

  return touched ? error : undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function invokeAll(...callbacks: any[]):()=>void {
  return () => {
    for (const callback of callbacks) {
      if (callback && typeof callback === 'function') {
        callback()
      }
    }
  }
}
interface ITargetObj 
{
    target: {
        name: string;
    }
}

export function createFakeEvent({ name }: { name: string }):ITargetObj
     {
  return { target: { name } }
}
