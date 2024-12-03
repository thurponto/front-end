import { useState, ChangeEvent, FormEvent } from 'react';
import styles from './cadastro.module.css';

interface FormData {
  nome: string;
  descricao?: string;
  salario: string;
  empresa: string;
}

const Cadastro: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    descricao: '',
    salario: '',
    empresa: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Validação dos campos de texto
    if (['nome', 'empresa', 'descricao'].includes(name)) {
      if (/^[a-zA-ZÀ-ÿ\s]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    }

    // Validação do campo salário
    if (name === 'salario') {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Verificação do salário
    if (formData.salario.length < 2) {
      alert('O salário deve conter no mínimo 2 dígitos.');
      return;
    }

    // Verificação dos outros campos
    if (!formData.nome || !formData.empresa) {
      alert('Todos os campos obrigatórios devem ser preenchidos.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/profissoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setFormData({
          nome: '',
          descricao: '',
          salario: '',
          empresa: '',
        });
      } else {
        const error = await response.json();
        alert(`Erro: ${error.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar profissão:', error);
      alert('Ocorreu um erro. Por favor, tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="nome" className={styles.label}>
          Nome:
        </label>
        <input
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="descricao" className={styles.label}>
          Descrição:
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          className={styles.textarea}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="salario" className={styles.label}>
          Salário:
        </label>
        <input
          id="salario"
          name="salario"
          type="text"
          value={formData.salario}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="empresa" className={styles.label}>
          Empresa:
        </label>
        <input
          id="empresa"
          name="empresa"
          value={formData.empresa}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <button type="submit" className={styles.button}>
        Cadastrar
      </button>
    </form>
  );
};

export default Cadastro;
