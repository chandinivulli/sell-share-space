-- Create app_role enum
create type public.app_role as enum ('admin', 'user', 'vendor');

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  created_at timestamp with time zone default now(),
  unique (user_id, role)
);

-- Enable RLS on user_roles
alter table public.user_roles enable row level security;

-- Create security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- RLS policies for user_roles
create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles for select
  using (public.has_role(auth.uid(), 'admin'));

-- Create products table
create table public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price decimal(10,2) not null,
  category text not null,
  vendor_id uuid references auth.users(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rating decimal(2,1) default 0,
  downloads integer default 0,
  github_url text,
  demo_url text,
  image_url text,
  tech_stack text[],
  features text[],
  rejection_reason text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on products
alter table public.products enable row level security;

-- RLS policies for products
create policy "Anyone can view approved products"
  on public.products for select
  using (status = 'approved' or vendor_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "Vendors can insert their own products"
  on public.products for insert
  with check (auth.uid() = vendor_id);

create policy "Vendors can update their own products"
  on public.products for update
  using (auth.uid() = vendor_id)
  with check (auth.uid() = vendor_id);

create policy "Admins can update any product"
  on public.products for update
  using (public.has_role(auth.uid(), 'admin'));

-- Create purchases table
create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  purchased_at timestamp with time zone default now(),
  unique (product_id, user_id)
);

-- Enable RLS on purchases
alter table public.purchases enable row level security;

-- RLS policies for purchases
create policy "Users can view their own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

create policy "Users can insert their own purchases"
  on public.purchases for insert
  with check (auth.uid() = user_id);

-- Create reviews table
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now(),
  unique (product_id, user_id)
);

-- Enable RLS on reviews
alter table public.reviews enable row level security;

-- RLS policies for reviews
create policy "Anyone can view reviews"
  on public.reviews for select
  using (true);

create policy "Users can insert their own reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

-- Create profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- RLS policies for profiles
create policy "Anyone can view profiles"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create trigger for updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_products_updated_at
  before update on public.products
  for each row execute function public.update_updated_at_column();

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

-- Create function to handle new user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.email);
  
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  
  return new;
end;
$$;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();