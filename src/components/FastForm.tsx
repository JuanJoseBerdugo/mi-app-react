import { useForm } from 'react-hook-form';

export const FastForm = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input { ...register("email")} />
      <button>Enviar</button>
    </form>
  );
};
