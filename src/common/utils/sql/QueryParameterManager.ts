export class QueryParameterManager {
  private parameters: unknown[];
  private parameterToPlaceholder: Map<string, number>;

  constructor() {
    this.parameters = [];
    this.parameterToPlaceholder = new Map<string, number>();
  }

  /**
   * Retrieves a copy of the current parameters.
   *
   * @returns {unknown[]} An array of all added parameters
   */
  public getParameters(): unknown[] {
    return [...this.parameters];
  }

  /**
   * Adds multiple parameters to the parameter list and updates the placeholder mapping
   *
   * @param newParameters - Array of new parameters to add
   */
  public addParameters(newParameters: unknown[]): void {
    newParameters.forEach((parameter: unknown) => {
      const key: string = this.getParameterKey(parameter);

      if (!this.parameterToPlaceholder.has(key)) {
        this.parameters.push(parameter);

        const placeholder: number = this.parameters.length;
        this.parameterToPlaceholder.set(key, placeholder);
      }
    });
  }

  /**
   * Adds a new parameter to the manager if it hasn't been added before.
   *
   * @param newParameter - The parameter to be added
   */
  public addParameter(newParameter: unknown): void {
    const key: string = this.getParameterKey(newParameter);

    if (!this.parameterToPlaceholder.has(key)) {
      this.parameters.push(newParameter);

      const placeholder: number = this.parameters.length;
      this.parameterToPlaceholder.set(key, placeholder);
    }
  }

  /**
   * Retrieves the placeholder number for a given parameter value.
   *
   * @param {unknown} value - The parameter value to find the placeholder for
   * @returns {number} The placeholder number associated with the parameter
   *
   * @throws {Error} If the parameter is not found in the existing parameters
   */
  public getPlaceholder(value: unknown): number {
    const key: string = this.getParameterKey(value);

    const placeholder: number | undefined =
      this.parameterToPlaceholder.get(key);

    if (placeholder === undefined) {
      throw new Error(`Parameter '${key}' not found`);
    }

    return placeholder;
  }

  /**
   * Converts a value to a unique string key for parameter tracking.
   *
   * @param {unknown} value - The value to convert to a key
   * @returns {string} A string representation of the value
   *
   * @remarks
   * - Date objects are converted to ISO string format
   * - Objects are stringified using JSON.stringify()
   * - Other types are converted using String()
   */
  private getParameterKey(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  }
}
