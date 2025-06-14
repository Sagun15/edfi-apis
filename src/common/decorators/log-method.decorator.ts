import { CustomLogger } from '../utils/logger/logger.service';

export function LogMethod() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const logger = new CustomLogger();
      logger.setContext(target.constructor.name);

      const start = Date.now();
      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - start;

        logger.logMethodCall(
          target.constructor.name,
          propertyKey,
          args,
          duration,
        );

        return result;
      } catch (err: unknown) {
        const duration = Date.now() - start;
        const error = err instanceof Error ? err : new Error(String(err));

        logger.logMethodCall(
          target.constructor.name,
          propertyKey,
          args,
          duration,
          error, // Now passing a proper Error object
        );
        throw error;
      }
    };

    // Copy all properties from original method
    Object.getOwnPropertyNames(originalMethod).forEach((key: string) => {
      const propertyDescriptor: PropertyDescriptor =
        Object.getOwnPropertyDescriptor(originalMethod, key);
      if (propertyDescriptor) {
        Object.defineProperty(descriptor.value, key, propertyDescriptor);
      }
    });

    // Copy all metadata for NestJS parameter decorators
    const metadataKeys: any[] = Reflect.getMetadataKeys(originalMethod);
    metadataKeys.forEach((key: any) => {
      const metadata: any = Reflect.getMetadata(key, originalMethod);
      Reflect.defineMetadata(key, metadata, descriptor.value);
    });

    return descriptor;
  };
}
