
export const Apiconfig = {
    instrumentationKey: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_AZURE_INSTRUMENTATION_KEY : "",
    // Other settings
};

export const FrontConfig = {
    instrumentationKey: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_FRONT_AZURE_INSTRUMENTATION_KEY : "",
    // Other settings
};
