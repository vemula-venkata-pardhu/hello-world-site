const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-6xl md:text-8xl font-light tracking-tight text-foreground">
          Hello<span className="text-accent">World</span>
        </h1>
        <p className="text-lg text-muted-foreground animate-slide-up" style={{ animationDelay: '0.3s' }}>
          Welcome to the beginning of something new.
        </p>
      </div>
    </div>
  );
};

export default Index;
